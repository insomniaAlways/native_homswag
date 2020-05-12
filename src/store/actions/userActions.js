import { USER_REQUEST_INITIATED, USER_REQUEST_SUCCESS, USER_REQUEST_FAILED, USER_DETAILS_UPDATED } from '../actionTypes';
import { findRecord, updateRecord } from '../asyncActions';

export const fetchUser = () => {
  return async (dispatch) => {
    try {
      dispatch(onStart())
      let res = await findRecord('me')
      return dispatch(onSuccess(res.data))
    } catch (e) {
      return dispatch(onError(e))
    }
  }
}

export const updateUser = (data) => {
  return function(dispatch) {
    dispatch(onStart())
    return updateRecord('me', null, data)
    .then(res => dispatch(onUserDetailsUpdate(res.data)))
    .catch(e => dispatch(onError(e)))
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
  if(error && error.response && error.response.data) {
    return {
      type: USER_REQUEST_FAILED,
      error: error.response.data
    }
  } else {
    return {
      type: USER_REQUEST_FAILED,
      error: error
    }
  }

}