
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  token: '',
  loggedIn: false,
  error: null,
  attempting: false,
});
const attempt = (state, action) => ({
  ...state,
  attempting: true,
  token: '',
  loggedIn: false,
  error: null,
});
const fbattempt = (state, action) => ({
  ...state,
  attempting: true,
  token: '',
  loggedIn: false,
  error: null,
});
const success = (state, action) => ({
  ...state,
  attempting: false,
  error: null,
  token: action.token,
  loggedIn: true,
});

const failure = (state, action) => ({
  ...state,
  token: '',
  loggedIn: false,
  attempting: false,
  error: action.error,
});

// map our types to our handlers
const actionHandlers = {
  [Types.LOGIN_ATTEMPT]: attempt,
  [Types.FBLOGIN_ATTEMPT]: fbattempt,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
};

export default createReducer(initialState, actionHandlers);
