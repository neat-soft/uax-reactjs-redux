import Types from './actionTypes';

export const filterAttempt = token =>
  ({ type: Types.FILTER_ATTEMPT, token });
