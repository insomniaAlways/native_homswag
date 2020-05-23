import { PACKAGE_REQUEST_INITIATED, PACKAGE_REQUEST_SUCCESS, PACKAGE_REQUEST_FAILED } from '../actionTypes';

import { query, findRecord, findAll } from '../asyncActions/index';

export const fetchPackages = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findAll('package')
    .then((res) => dispatch(onSuccess(res.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: PACKAGE_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: PACKAGE_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: PACKAGE_REQUEST_FAILED,
      error: error.response.data
    }
  } else {
    return {
      type: PACKAGE_REQUEST_FAILED,
      error: error
    }
  }
}