import api from '../utils/api';
import { HACER_PREMIUM, GET_HISTORIAL_TRANSACCIONES, ACTUALIZAR_ESTADO_TRANSACCION } from './types';
import { message } from 'antd';

export const hacerPremium = () => async (dispatch) => {
  try {
    const res = await api.post('/billing/hacer-premium');
    dispatch({
      type: HACER_PREMIUM,
      payload: res.data,
    });
    message.success('Solicitud de suscripción realizada exitosamente');
    return res.data;
  } catch (err) {
    message.error('Error al solicitar suscripción');
  }
};

export const getHistorialTransacciones = () => async (dispatch) => {
  try {
    const res = await api.get('/billing/historial');
    dispatch({
      type: GET_HISTORIAL_TRANSACCIONES,
      payload: res.data,
    });
  } catch (err) {
    message.error('Error al obtener el historial de transacciones');
  }
};

export const actualizarEstadoTransaccion = (id, estado) => async (dispatch) => {
  try {
    const res = await api.put(`/billing/actualizar-estado/${id}`, { estado });
    dispatch({
      type: ACTUALIZAR_ESTADO_TRANSACCION,
      payload: res.data,
    });
    message.success('Estado de transacción actualizado exitosamente');
  } catch (err) {
    message.error('Error al actualizar estado de transacción');
  }
};
