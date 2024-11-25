import { GET_CHATS, CHAT_ERROR, CREATE_CHAT, GET_MESSAGES, SEND_MESSAGE } from './types';
import api from '../utils/api';

export const getChats = () => async dispatch => {
  try {
    const res = await api.get('/chats');
    dispatch({
      type: GET_CHATS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createChat = (profileId) => async dispatch => {
  try {
    const res = await api.post('/chats', { profileId });
    dispatch({
      type: CREATE_CHAT,
      payload: res.data
    });
    return res.data._id;
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getMessages = (chatId) => async dispatch => {
  try {
    const res = await api.get(`/chats/${chatId}/messages`);
    dispatch({
      type: GET_MESSAGES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const sendMessage = (chatId, content, type = 'message', attachment = null) => async dispatch => {
  try {
    const res = await api.post('/messages', { chatId, content, type, attachment });
    dispatch({
      type: SEND_MESSAGE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CHAT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
