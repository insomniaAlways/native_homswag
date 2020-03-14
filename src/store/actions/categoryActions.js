import { CATEGORY_REQUEST_INITIATED, CATEGORY_REQUEST_SUCCESS, CATEGORY_REQUEST_FAILED } from '../actionTypes';
import { findAll } from '../asyncActions/index';

export const fetchCategories = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findAll('category')
    .then((response) => dispatch(onSuccess(response.data)))
    .catch((e) => dispatch(onError(e.response.data)))
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
  return {
    type: CATEGORY_REQUEST_FAILED,
    payload: error
  }
}