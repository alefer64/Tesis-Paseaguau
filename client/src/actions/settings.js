import api from '../utils/api';
import { setAlert } from './alert';

import {
  ACCOUNT_DELETED,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_ERROR,
  CLEAR_PROFILE,
  PROFILE_ERROR,
  UPDATE_PRICE,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
  GET_ADDRESS,
  UPLOAD_PHOTO,
  DELETE_PHOTO,
  BANNER_UPLOAD,
  DELETE_BANNER,
  UPDATE_HORARIOS,
  GET_HORARIOS,
  HORARIOS_ERROR,
} from './types';

export const changePassword = (passwordData) => async (dispatch) => {
  try {
    const response = await api.post(`/users/changepassword`, passwordData);
    dispatch({
      type: CHANGE_PASSWORD,
      payload: response.data
    });
    dispatch(setAlert('Contraseña cambiada', 'success'));
  } catch (error) {
    dispatch({
      type: CHANGE_PASSWORD_ERROR,
      payload: { msg: error.response.data.msg }
    });
  }
};

export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await api.delete('/profile');

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert('Your account has been permanently deleted'));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};

export const updatePricing = (pricingData) => async (dispatch) => {
  try {
    const response = await api.put('/settings/pricing', pricingData);
    dispatch({
      type: UPDATE_PRICE,
      payload: response.data
    });
    dispatch(setAlert('Precio actualizado', 'success'));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.data.msg }
    });
  }
};

export const updateAddress = (formData) => async (dispatch) => {
  try {
    const res = await api.put('/settings/direccion', formData);
    dispatch({
      type: UPDATE_ADDRESS,
      payload: res.data
    });

    dispatch(setAlert('Dirección actualizada', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteAddress = () => async (dispatch) => {
  try {
    await api.delete('/settings/direccion');
    dispatch({
      type: DELETE_ADDRESS
    });

    dispatch(setAlert('Dirección eliminada', 'success'));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getAddress = () => async (dispatch) => {
  try {
    const res = await api.get('/settings/direccion');
    dispatch({
      type: GET_ADDRESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const uploadPhoto = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/settings/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch({
      type: UPLOAD_PHOTO,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deletePhoto = (url) => async (dispatch) => {
  try {
    const res = await api.delete('/settings/upload', { data: { url } });
    dispatch({
      type: DELETE_PHOTO,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const uploadBanner = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/settings/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    dispatch({
      type: BANNER_UPLOAD,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteBanner = () => async (dispatch) => {
  try {
    const res = await api.delete('/settings/banner');
    dispatch({
      type: DELETE_BANNER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getHorarios = () => async (dispatch) => {
  try {
    const res = await api.get('/settings/horarios');
    dispatch({
      type: GET_HORARIOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: HORARIOS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const updateHorarios = (horarios) => async (dispatch) => {
  try {
    const res = await api.put('/settings/horarios', horarios);
    dispatch({
      type: UPDATE_HORARIOS,
      payload: res.data
    });
    dispatch(setAlert('Horarios actualizados', 'success'));
  } catch (err) {
    dispatch({
      type: HORARIOS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
