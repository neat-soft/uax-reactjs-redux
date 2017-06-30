import { combineReducers } from 'redux-immutable';
import globals from './globals';
import route from './route';
import login from './login';
import signup from './signup';
import productinfo from './productinfo';
import filter from './filter';

const applicationReducers = {
  globals,
  route,
  login,
  signup,
  productinfo,
  filter,
};

export default function createReducer() {
  return combineReducers(applicationReducers);
}
