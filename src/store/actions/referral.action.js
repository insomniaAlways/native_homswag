import {
  REFERRAL_REQUEST_INITIATED,
  REFERRAL_REQUEST_FAILED,
  REFERRAL_REQUEST_SUCCEED
} from '../actionTypes';

import {
  createRecord
} from '../asyncActions/index';

export const applyReferral = (data) => {
  return function (dispatch) {
    dispatch(onStart())
    return createRecord('referral', data)
      .then((res) => dispatch(onSuccess(res.data)))
      .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: REFERRAL_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: REFERRAL_REQUEST_SUCCEED,
    payload: payload
  }
}

export const onError = (error) => {
  if (error && error.response && error.response.data) {
    return {
      type: REFERRAL_REQUEST_FAILED,
      error: error.response.data
    }
  } else {
    return {
      type: REFERRAL_REQUEST_FAILED,
      error: error
    }
  }
}