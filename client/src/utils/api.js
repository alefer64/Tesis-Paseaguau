import axios from 'axios';
import store from '../store';
import { LOGOUT } from '../actions/types';

const baseURL = process.env.REACT_APP_AXIOS_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      store.dispatch({ type: LOGOUT });
    }
    return Promise.reject(err);
  }
);

export default api;
