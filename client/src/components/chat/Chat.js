import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { getMessages, sendMessage, getChats } from '../../actions/chat';
import PropTypes from 'prop-types';
import { useParams, useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { Button, Modal, List, Avatar, Card } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import './css/Chat.css';

const Chat = ({ getMessages, sendMessage, getChats, messages, chats, auth: { user } }) => {
  const { chatId } = useParams();
  const [content, setContent] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getChats();
  }, [getChats]);

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
    }
  }, [chatId]);

  useEffect(() => {
    if (activeChat) {
      getMessages(activeChat);
      socket.current = socketIOClient(process.env.REACT_APP_SOCKET_URL);
      socket.current.emit('joinChat', { chatId: activeChat });
      socket.current.on('message', () => getMessages(activeChat));
      return () => socket.current.disconnect();
    }
  }, [activeChat, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (activeChat && content.trim()) {
      await sendMessage(activeChat, content, 'message');
      setContent('');
      socket.current.emit('sendMessage', { chatId: activeChat, content, type: 'message' });
      getMessages(activeChat);
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    navigate(`/chats/${chatId}`);
  };

  const handleAttach = () => setShowAttachModal(true);

  const handleConfirmAttach = (type, item) => {
    if (type === 'direccion') {
      const address = {
        calle: user.address.calle,
        pisoDpto: user.address.pisoDpto,
        barrio: user.address.barrio,
        localidad: user.address.localidad,
      };
      sendMessage(activeChat, '', 'attachment', { type: 'direccion', address });
      socket.current.emit('sendMessage', { chatId: activeChat, content: '', type: 'attachment', attachment: { type: 'direccion', address } });
    } else if (type === 'mascota') {
      const petDetails = {
        name: item.name,
        breed: item.breed,
        size: item.size,
        sex: item.sex,
        ageNumber: item.ageNumber,
        ageUnit: item.ageUnit,
        observations: item.observations,
        image: item.image
      };
      sendMessage(activeChat, '', 'attachment', { type: 'mascota', petDetails });
      socket.current.emit('sendMessage', { chatId: activeChat, content: '', type: 'attachment', attachment: { type: 'mascota', petDetails } });
    }
    setShowAttachModal(false);
    getMessages(activeChat);
  };

  const renderContent = (message) => {
    if (message.type === 'message') {
      return <span>{message.content}</span>;
    } else if (message.type === 'attachment') {
      if (message.attachment.type === 'mascota') {
        const { petDetails } = message.attachment;
        return (
          <Card cover={<img alt={petDetails.name} src={`${process.env.REACT_APP_IMG_URL}${petDetails.image}`} />} style={{ width: 300, marginTop: 16 }}>
            <Card.Meta
              title={petDetails.name}
              description={
                <div>
                  <p>Raza: {petDetails.breed}</p>
                  <p>Tamaño: {petDetails.size}</p>
                  <p>Sexo: {petDetails.sex}</p>
                  <p>Edad: {petDetails.ageNumber} {petDetails.ageUnit}</p>
                  <p>Observaciones: {petDetails.observations}</p>
                </div>
              }
            />
          </Card>
        );
      } else if (message.attachment.type === 'direccion') {
        const { calle, pisoDpto, barrio, localidad } = message.attachment.address;
        return (
          <div>
            Calle: {calle}<br />
            {pisoDpto && `Piso: ${pisoDpto}`}<br />
            Barrio: {barrio}<br />
            Localidad: {localidad}
          </div>
        );
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-list">
        {chats.length === 0 ? (
          <div className="no-chats-message">Aún no tienes chats iniciados</div>
        ) : (
          chats.map(chat => {
            const otherParticipant = chat.participants.find(participant => participant._id !== user._id);
            return (
              <div key={chat._id} className="chat-list-item" onClick={() => handleChatSelect(chat._id)}>
                <img src={`${process.env.REACT_APP_IMG_URL}${otherParticipant.avatar}`} alt="Avatar" className="avatar" />
                <div className="chat-details">
                  <p className="chat-name">{otherParticipant.name}</p>
                  <p className="chat-last-message">{chat.messages[chat.messages.length - 1]?.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="chat-area">
        <div className="messages">
          {messages.map(message => (
            <div key={message._id} className={`message-item ${message.sender._id === user._id ? 'own-message' : ''}`}>
              <div className="message-header">
                <span className="message-sender">{message.sender.name}</span>
                <span className="message-timestamp">{new Date(message.createdAt).toLocaleString()}</span>
              </div>
              <div className="message-content">{renderContent(message)}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="message-input">
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
          <Button icon={<PaperClipOutlined />} onClick={handleAttach} />
          <button type="submit">Enviar</button>
        </form>
      </div>
      <Modal title="Adjuntar" open={showAttachModal} onCancel={() => setShowAttachModal(false)} footer={null}>
        <Button type='primary' block onClick={() => handleConfirmAttach('direccion')}>Compartir Dirección</Button>
        <List
          itemLayout="horizontal"
          dataSource={user.pets}
          renderItem={item => (
            <List.Item actions={[<Button onClick={() => handleConfirmAttach('mascota', item)}>Compartir</Button>]}>
              <List.Item.Meta
                avatar={<Avatar src={`${process.env.REACT_APP_IMG_URL}${item.image}`} />}
                title={item.name}
                description={`Raza: ${item.breed}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

Chat.propTypes = {
  getMessages: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  getChats: PropTypes.func.isRequired,
  messages: PropTypes.array.isRequired,
  chats: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  messages: state.chats.messages || [],
  chats: state.chats.chats || [],
  auth: state.auth,
});

export default connect(mapStateToProps, { getMessages, sendMessage, getChats })(Chat);
