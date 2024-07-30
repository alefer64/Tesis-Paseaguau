import {
  GET_PETS,
  ADD_PET,
  DELETE_PET,
  EDIT_PET,
  PET_ERROR
} from '../actions/types';

const initialState = {
  mascotas: [],
  loading: true,
  error: {}
};

export default function petReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PETS:
      return {
        ...state,
        mascotas: payload,
        loading: false
      };
    case ADD_PET:
      return {
        ...state,
        mascotas: [payload, ...state.mascotas],
        loading: false
      };
    case EDIT_PET:
      return {
        ...state,
        mascotas: state.mascotas.map((mascota) =>
          mascota._id === payload._id ? payload : mascota
        ),
        loading: false
      };
    case DELETE_PET:
      return {
        ...state,
        mascotas: state.mascotas.filter((mascota) => mascota._id !== payload),
        loading: false
      };
    case PET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
