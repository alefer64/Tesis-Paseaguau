const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Chat = require('../../models/ChatSchema');
const Message = require('../../models/MessageSchema');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   POST api/chats
// @desc    Create a new chat
// @access  Private
router.post('/', auth, async (req, res) => {
  const { profileId } = req.body;
  const userId = req.user.id;
  const user = await User.findOne({ _id: userId });
  try {
    const profile = await Profile.findOne({ _id: profileId });
    const profileUser = await User.findOne({ _id: profile.user });

    if (!profileUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.verified){
      return res.status(400).json({ msg: 'You must verify your email to chat with other users' });
    }

    const existingChat = await Chat.findOne({
      participants: { $all: [userId, profile.user] }
    });

    if (existingChat) {
      return res.status(400).json({ msg: 'Chat already exists' });
    }

    const newChat = new Chat({
      participants: [userId, profileUser._id]
    });

    const chat = await newChat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/chats/message
// @desc    Send a message
// @access  Private
router.post('/message', auth, async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId) {
    return res.status(400).json({ msg: 'Chat ID is required' });
  }

  try {
    const newMessage = new Message({
      chat: chatId,
      sender: req.user.id,
      content
    });

    const message = await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    });

    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chats
// @desc    Get all chats for the user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.id }).populate('participants', ['name', 'avatar']);
    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/chats/:chatId/messages
// @desc    Get all messages for a chat
// @access  Private
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).sort({ createdAt: 1 }).populate('sender', 'name avatar');
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
