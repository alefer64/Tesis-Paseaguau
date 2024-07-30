import { GET_MESSAGES, SEND_MESSAGE, GET_CHATS, CHAT_ERROR, CREATE_CHAT } from '../actions/types';

const initialState = {
  messages: [],
  chats: [],
  loading: true,
  error: {}
};

export default function chatReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MESSAGES:
      return {
        ...state,
        messages: payload,
        loading: false
      };
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload],
        loading: false
      };
    case GET_CHATS:
      return {
        ...state,
        chats: payload,
        loading: false
      };
    case CREATE_CHAT:
      return {
        ...state,
        chats: [payload, ...state.chats],
        loading: false
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
