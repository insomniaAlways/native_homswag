import { REWARD_REQUEST_INITIATED, REWARD_REQUEST_FAILED, REWARD_REQUEST_SUCCEED } from '../actionTypes';

import { createRecord } from '../asyncActions/index';

export const applyReward = () => {
  return function(dispatch) {
    dispatch(onStart())
    return createRecord('me/apply-reward')
    .then((res) => dispatch(onSuccess(res.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: REWARD_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: REWARD_REQUEST_SUCCEED,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: REWARD_REQUEST_FAILED,
      error: error.response.data
    }
  } else {
    return {
      type: REWARD_REQUEST_FAILED,
      error: error
    }
  }
}