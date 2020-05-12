import { CART_REQUEST_FAILED, CART_REQUEST_INITIATED, CART_REQUEST_SUCCESS } from '../actionTypes';

import { findRecord } from '../asyncActions/index';

export const fetchCart = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findRecord('cart')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: CART_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: CART_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: CART_REQUEST_FAILED,
      error: error.response.data
    }  
  } else {
    return {
      type: CART_REQUEST_FAILED,
      error: error
    }
  }
}