import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '@actions/actionTypes';
import api from '@api/api';
import { loginSuccess, loginFailure } from '@actions/login';
import { Global } from '@theme';

const apis = api.create(Global.API_URL);

function* runFbLogin(action) {
  try {
    const user = yield call(apis.fblogin, action.fbtoken);
    if (user.ok) {
      yield put(loginSuccess(user.data.token));
    } else {
      yield put(loginFailure(user.data.error));
    }
  } catch (error) {
    yield put(loginFailure(error));
  }
}

export function* fbloginAttempt() {
  yield takeLatest(Types.FBLOGIN_ATTEMPT, runFbLogin);
}
