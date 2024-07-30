import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';
import settings from './settings';
import pet from './pet';
import sol from './solicitudes';
import billing from './billing';
import chats from './chat';

export default combineReducers({
  alert,
  auth,
  profile,
  pet,
  sol,
  settings,
  billing,
  chats,
});
