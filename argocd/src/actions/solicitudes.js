import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_SOLICITUDES,
  SOLICITUD_ERROR,
  DELETE_SOLICITUD,
  GET_SOLITUD
} from './types';

export const getSolicitudes = () => async (dispatch) => {
  try {
    const res = await api.get('solicitudes/solicitudes-pendientes');
    dispatch({
      type: GET_SOLICITUDES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SOLICITUD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const deleteSolicitud = (id) => async (dispatch) => {
  try {
    await api.delete(`solicitudes/eliminar-solicitud/${id}`);

    dispatch({
      type: DELETE_SOLICITUD,
      payload: id
    });

    dispatch(setAlert('Solicitud eliminada', 'success'));
  } catch (err) {
    dispatch({
      type: SOLICITUD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const getSolicitud = () => async (dispatch) => {
  try {
    const res = await api.get(`solicitudes/mi-solicitud/`);
    dispatch({
      type: GET_SOLITUD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SOLICITUD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const aprobarSolicitud = (id) => async (dispatch) => {
  try {
    await api.put(`solicitudes/aprobar-solicitud/${id}`);

    dispatch(setAlert('Solicitud aprobada', 'success'));
  } catch (err) {
    dispatch({
      type: SOLICITUD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}
