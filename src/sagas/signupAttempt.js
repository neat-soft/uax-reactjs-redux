import { put, call, takeLatest } from 'redux-saga/effects';
import Types from '@actions/actionTypes';
import api from '@api/api';
import { signupSuccess, signupFailure } from '@actions/signup';
import { Global } from '@theme';

const apis = api.create(Global.API_URL);

function* runSignup(action) {
  try {
    const ret = yield call(apis.signup, action.userinfo.user);
    console.log(ret);
    if (ret.ok) {
      yield put(signupSuccess(ret.ok));
    } else {
      yield put(signupSuccess(ret.ok));
    }
  } catch (error) {
    yield put(signupFailure(error));
  }
}

export function* signupAttempt() {
  yield takeLatest(Types.SIGNUP_ATTEMPT, runSignup);
}
