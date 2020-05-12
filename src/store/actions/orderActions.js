import { ORDER_REQUEST_FAILED, ORDER_REQUEST_INITIATED, ORDER_REQUEST_SUCCESS, ORDER_CREATE_REQUEST_SUCCESS, ORDER_UPDATE } from '../actionTypes';

import { query, findRecord, createRecord, updateRecord } from '../asyncActions/index';

export const fetchAllOrder = () => {
  return function(dispatch) {
    dispatch(onStart())
    return query('order')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const fetchOrder = (order_id) => {
  return function(dispatch) {
    return findRecord('order', order_id)
    .then(res => dispatch(createOrder(res.data)))
    .catch(e => dispatch(onError(e)))
  }
}

export const createOrder = (orderDetails) => {
  return function(dispatch) {
    dispatch(onStart())
    return createRecord('order', orderDetails)
    .then((res) => dispatch(orderCreated(res.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const updateOrder = (order_id, order_status) => {
  return function(dispatch) {
    dispatch(onStart())
    return updateRecord('order', order_id, { status: order_status })
    .then((res) => dispatch(onUpdate(res.data)))
    .catch((e) => dispatch(onError(e))) 
  }
}

export const orderCreated = (payload) => {
  return {
    type: ORDER_CREATE_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onStart = () => {
  return {
    type: ORDER_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: ORDER_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: ORDER_REQUEST_FAILED,
      error: error.response.data
    }
  } else {
    return {
      type: ORDER_REQUEST_FAILED,
      error: error
    }
  }
}

const onUpdate = (payload) => {
  return {
    type: ORDER_UPDATE,
    payload: payload
  }
}