import { USER_REQUEST_INITIATED, USER_REQUEST_SUCCESS, USER_REQUEST_FAILED, USER_DETAILS_UPDATED } from '../actionTypes';
import { findRecord, updateRecord } from '../asyncActions';

export const fetchUser = () => {
  return function(dispatch) {
    dispatch(onStart())
    return findRecord('me')
    .then(res => dispatch(onSuccess(res.data)))
    .catch(e => dispatch(onError(e.response.data)))
  }
}

export const updateUser = (data) => {
  return function(dispatch) {
    dispatch(onStart())
    return updateRecord('me', null, data)
    .then(res => dispatch(onUserDetailsUpdate(res.data)))
    .catch(e => dispatch(onError(e.response.data)))
  }
}

const onUserDetailsUpdate = (payload) => {
  return {
    type: USER_DETAILS_UPDATED,
    payload: payload
  }
}
export const onStart = () => {
  return {
    type: USER_REQUEST_INITIATED,
  }
}

export const onSuccess = (payload) => {
  return {
    type: USER_REQUEST_SUCCESS,
    payload: payload
  }
}

export const onError = (error) => {
  return {
    type: USER_REQUEST_FAILED,
    error: error
  }
}