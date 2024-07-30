import {
  GET_SOLICITUDES,
  DELETE_SOLICITUD,
  GET_SOLITUD,
  ACEPTAR_SOLICITUD
} from '../actions/types';

const initialState = {
  solicitudes: [],
  loading: true,
  error: {}
};

function solReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
      case GET_SOLICITUDES:
      return {
        ...state,
        solicitudes: payload,
        loading: false
      }
      case DELETE_SOLICITUD:
      return {
        ...state,
        solicitudes: state.solicitudes.filter((solicitud) => solicitud._id !== payload),
        loading: false
      }
    case GET_SOLITUD:
      return {
        ...state,
        solicitudes: payload,
        loading: false
      };
      case ACEPTAR_SOLICITUD:
      return {
        ...state,
        solicitudes: state.solicitudes.map((solicitud) =>
          solicitud._id === payload.id
            ? { ...solicitud, estado: payload.estado }
            : solicitud
        ),
        loading: false
      }
    default:
      return state;
  }
}

export default solReducer;
