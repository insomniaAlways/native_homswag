import { CATEGORY_REQUEST_INITIATED, CATEGORY_REQUEST_SUCCESS, CATEGORY_REQUEST_FAILED } from '../actionTypes';
import { findAll } from '../asyncActions/index';

export const fetchCategories = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findAll('category')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e)))
  }
}

export const onStart = () => {
  return {
    type: CATEGORY_REQUEST_INITIATED
  }
}

export const onSuccess = (payload) => {
  return {
    type: CATEGORY_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  if(error && error.response && error.response.data) {
    return {
      type: CATEGORY_REQUEST_FAILED,
      payload: error.response.data
    }
  } else {
    return {
      type: CATEGORY_REQUEST_FAILED,
      payload: error
    }
  }
}