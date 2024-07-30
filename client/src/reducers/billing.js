import { HACER_PREMIUM, GET_HISTORIAL_TRANSACCIONES, ACTUALIZAR_ESTADO_TRANSACCION } from '../actions/types';

const initialState = {
  historial: [],
};

export default function billingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case HACER_PREMIUM:
      return {
        ...state,
        historial: [payload, ...state.historial],
      };
    case GET_HISTORIAL_TRANSACCIONES:
      return {
        ...state,
        historial: payload,
      };
    case ACTUALIZAR_ESTADO_TRANSACCION:
      return {
        ...state,
        historial: state.historial.map(transaccion =>
          transaccion._id === payload._id ? payload : transaccion
        ),
        retiros: state.retiros.map(retiro =>
          retiro._id === payload._id ? payload : retiro
        ),
      };
    default:
      return state;
  }
}
