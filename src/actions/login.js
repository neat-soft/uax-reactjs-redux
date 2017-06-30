import Types from './actionTypes';

export const loginAttempt = userinfo =>
  ({ type: Types.LOGIN_ATTEMPT, userinfo });
export const fbloginAttempt = fbtoken =>
  ({ type: Types.FBLOGIN_ATTEMPT, fbtoken });
export const loginSuccess = token =>
  ({ type: Types.LOGIN_SUCCESS, token });
export const loginFailure = error =>
  ({ type: Types.LOGIN_FAILURE, error });
