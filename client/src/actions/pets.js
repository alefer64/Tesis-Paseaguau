import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_PETS,
  ADD_PET,
  DELETE_PET,
  EDIT_PET,
  PET_ERROR
} from './types';

export const getCurrentPets = () => async (dispatch) => {
  try {
    const res = await api.get('/pets');
    dispatch({
      type: GET_PETS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PET_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const addPet = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const res = await api.post('/pets/newpet', formData, config);

    dispatch({
      type: ADD_PET,
      payload: res.data
    });

    dispatch(setAlert('Mascota agregada', 'success'));
  } catch (err) {
    dispatch({
      type: PET_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const editPet = (petId, formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const res = await api.put(`/pets/${petId}`, formData, petId, config);

    dispatch({
      type: EDIT_PET,
      payload: res.data
    });

    dispatch(setAlert('Mascota actualizada', 'success'));
  } catch (err) {
    dispatch({
      type: PET_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deletePet = (petId) => async (dispatch) => {
  try {
    await api.delete(`/pets/${petId}`);

    dispatch({
      type: DELETE_PET,
      payload: petId
    });

    dispatch(setAlert('Mascota eliminada', 'success'));
  } catch (err) {
    dispatch({
      type: PET_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
