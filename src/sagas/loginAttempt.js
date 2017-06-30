import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '@actions/actionTypes';
import api from '@api/api';
import store from 'react-native-simple-store';
import { loginSuccess, loginFailure } from '@actions/login';
import { Global } from '@theme';

const apis = api.create(Global.API_URL);

function* runLogin(action) {
  try {
    const user = yield call(apis.login, action.userinfo.user);
    if (user.ok) {
      store.save('token', user.data.token);
      yield put(loginSuccess(user.data.token));
    } else {
      console.log('Error login ');
      yield put(loginFailure('error'));
    }
  } catch (error) {
    yield put(loginFailure('error'));
  }
}

export function* loginAttempt() {
  yield takeLatest(Types.LOGIN_ATTEMPT, runLogin);
}
