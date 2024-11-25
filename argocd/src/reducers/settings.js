import {
  CHANGE_PASSWORD,
  UPDATE_HORARIOS,
  CLEAR_PROFILE,
  UPDATE_PRICE,
  UPDATE_ADDRESS,
  GET_ADDRESS,
  DELETE_ADDRESS,
  UPLOAD_PHOTO,
  DELETE_PHOTO,
  BANNER_UPLOAD,
  DELETE_BANNER,
  GET_HORARIOS,
  HORARIOS_ERROR
} from '../actions/types';

const initialState = {
  horarios: {
    mañana: [],
    tarde: [],
    noche: []
  },
  passwordChanged: false,
  loading: true,
  error: {}
};


function settingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CHANGE_PASSWORD:
      return {
        ...state,
        passwordData: payload,
        passwordChanged: true
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        repos: []
      };
    case UPDATE_PRICE:
      return {
        ...state,
        pricePerWalk: payload
      };
    case UPDATE_ADDRESS:
      return {
        ...state,
        address: payload
      };
    case GET_ADDRESS:
      return {
        ...state,
        address: payload,
        loading: false
      };
    case DELETE_ADDRESS:
      return {
        ...state,
        address: null,
        loading: false
      };
    case DELETE_PHOTO:
      return {
        ...state,
        foto: payload,
        loading: false
      };
    case UPLOAD_PHOTO:
      return {
        ...state,
        foto: payload,
        loading: false
      };
    case BANNER_UPLOAD:
      return {
        ...state,
        banner: payload,
        loading: false
      };
    case DELETE_BANNER:
      return {
        ...state,
        banner: null,
        loading: false
      };
    case UPDATE_HORARIOS:
      return {
        ...state,
        profile: { ...state.profile, horarios: payload },
        loading: false
      };
    case GET_HORARIOS:
      return {
        ...state,
        horarios: payload,
        loading: false
      };
    case HORARIOS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default settingReducer;
