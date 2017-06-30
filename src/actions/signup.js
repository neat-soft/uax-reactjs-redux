import Types from './actionTypes';

export const signupAttempt = userinfo =>
  ({ type: Types.SIGNUP_ATTEMPT, userinfo });
export const signupSuccess = signed =>
  ({ type: Types.SIGNUP_SUCCESS, signed });
export const signupFailure = error =>
  ({ type: Types.SIGNUP_FAILED, error });
