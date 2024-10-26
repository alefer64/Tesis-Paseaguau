import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  GET_PROFILES,
  GET_PROFILEID,
  SEARCH_PROFILES
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
        profile: null
      };
    case GET_PROFILEID:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case SEARCH_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    default:
      return state;
  }
}

export default profileReducer;
