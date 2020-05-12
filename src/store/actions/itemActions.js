import { ITEM_REQUEST_INITIATED, ITEM_REQUEST_SUCCESS, ITEM_REQUEST_FAILED } from '../actionTypes';
import { findAll } from '../asyncActions/index';

export const fetchItems = (category_id) => {
  let query = `category_id=${category_id}`
  return function(dispatch) {
    dispatch(onStart())
    return findAll('item', query)
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const fetchAllItems = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findAll('item')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: ITEM_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: ITEM_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: ITEM_REQUEST_FAILED,
      payload: error.response.data
    }
  } else {
    return {
      type: ITEM_REQUEST_FAILED,
      payload: error
    }
  }
}