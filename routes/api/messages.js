const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Messages = require('../../models/MessageSchema');
const Chat = require('../../models/ChatSchema');
const User = require('../../models/User');

// @route   POST api/messages
// @desc    Send a message
// @access  Private
router.post('/', auth, async (req, res) => {
  const { chatId, content, type, attachment } = req.body;

  try {
    const newMessage = new Messages({
      chat: chatId,
      sender: req.user.id,
      content,
      type,
      attachment
    });

    const message = await newMessage.save();

    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    });

    const populatedMessage = await Messages.findById(message._id).populate('sender', 'name avatar');

    res.json(populatedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
