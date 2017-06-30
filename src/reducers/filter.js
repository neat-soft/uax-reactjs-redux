
import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';
import Types from '@actions/actionTypes';

export const initialState = Immutable({
  filterValue: {},
  attempting: false,
  getFiltered: false,
  error: null,
});
const attempt = (state, action) => ({
  ...state,
  attempting: true,
  getFiltered: false,
  error: null,
});

const success = (state, action) => ({
  ...state,
  attempting: false,
  filterValue: action.filterValue,
  getFiltered: true,
  error: null,
});

const failure = (state, action) => ({
  ...state,
  filterValue: {},
  attempting: false,
  getFiltered: false,
  error: action.error,
});

// map our types to our handlers
const actionHandlers = {
  [Types.FILTER_ATTEMPT]: attempt,
  [Types.FILTER_SUCCESS]: success,
  [Types.FILTER_FAILURE]: failure,
};

export default createReducer(initialState, actionHandlers);
