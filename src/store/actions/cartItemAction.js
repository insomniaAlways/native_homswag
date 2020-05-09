import {
  CARTITEM_REQUEST_FAILED,
  CARTITEM_REQUEST_INITIATED,
  CARTITEM_REQUEST_SUCCESS,
  MERGE_CARTITEMS,
  CARTITEM_CREATE_SUCCESS,
  CARTITEM_DELETE_SUCCESS,
  CARTITEM_UPDATE_SUCCESS } from '../actionTypes';

import { query, createRecord, updateRecord, deleteRecord } from '../asyncActions/index';

export const fetchCartItems = () => {
  return function(dispatch) {
    dispatch(onStart())
    return query('cart-item')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e.response.data)))
  }
}

export const createCartItem = (item_id, totalPrice, is_package=false) => {
  return function(dispatch) {
    let key = is_package ? "package_id" : "item_id"
    let cartItem = {
      "cart_id": 1,
      [key]: item_id,
      "quantity": 1,
      "total_price": totalPrice,
      "is_package": is_package
    }
    dispatch(onStart())
    return createRecord('cart-item', cartItem)
    .then((response) => dispatch(onCreateSuccess(response.data)))
    .catch((error) => dispatch(onError(error.response.data)))
  }
}

const onCreateSuccess = (payload) => {
  return {
    type: CARTITEM_CREATE_SUCCESS,
    payload: payload
  }
}

export const updateItem = (cart_item_id, quantity, totalPrice) => {
  return function(dispatch) {
    dispatch(onStart())
    let cartItem = {
      "quantity": quantity,
      "total_price": totalPrice,
    }
    return updateRecord('cart-item', cart_item_id, cartItem)
    .then((response) => dispatch(updateCartItem(response.data)))
    .catch(e => dispatch(onError(e.response.data)))
  }
}

const updateCartItem = (payload) => {
  return {
    type: CARTITEM_UPDATE_SUCCESS,
    payload: payload
  }
}

export const deleteItem = (cart_item_id) => {
  return function(dispatch) {
    dispatch(onStart())
    return deleteRecord('cart-item', cart_item_id)
    .then(() => dispatch(onDeleteCartItem(cart_item_id)))
    .catch(e => dispatch(onError(e.response.data)))
  }
}

const onDeleteCartItem = (payload_id) => {
  return {
    type: CARTITEM_DELETE_SUCCESS,
    payload: payload_id
  }
}

export const onStart = () => {
  return {
    type: CARTITEM_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: CARTITEM_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  return {
    type: CARTITEM_REQUEST_FAILED,
    payload: error
  }
}

export const mergeItems = (payload) => {
  return {
    type: MERGE_CARTITEMS,
    payload: payload
  }
}