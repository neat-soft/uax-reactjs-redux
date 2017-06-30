
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  signedUp: false,
  attempting: false,
  error: '',
});
const attempt = (state, action) => ({
  ...state,
  attempting: true,
  signedUp: false,
  error: null,
});

const success = (state, action) => ({
  ...state,
  attempting: false,
  signedUp: action.signed,
  error: null,
});

const failure = (state, action) => ({
  ...state,
  attempting: false,
  error: action.error,
});

const actionHandlers = {
  [Types.SIGNUP_ATTEMPT]: attempt,
  [Types.SIGNUP_SUCCESS]: success,
  [Types.SIGNUP_FAILED]: failure,
};

export default createReducer(initialState, actionHandlers);
