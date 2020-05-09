import { CART_REQUEST_FAILED, CART_REQUEST_INITIATED, CART_REQUEST_SUCCESS } from '../actionTypes';

import { query, findRecord } from '../asyncActions/index';

export const fetchCart = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findRecord('cart')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e.response.data)))
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
  return {
    type: CART_REQUEST_FAILED,
    payload: error
  }
}