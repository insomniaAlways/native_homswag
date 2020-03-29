import { USER_REQUEST_INITIATED, USER_REQUEST_SUCCESS, USER_REQUEST_FAILED, USER_DETAILS_UPDATED } from '../actionTypes';
import { findRecord, updateRecord } from '../asyncActions';
import moment from 'moment';

export const fetchUser = () => {
  return async (dispatch) => {
    try {
      console.log('user triggered', moment().format('s:SSS'))
      dispatch(onStart())
      let res = await findRecord('me')
      console.log('user response', moment().format('s:SSS'))
      dispatch(onSuccess(res.data))
    } catch (e) {
      if(e && e.response && e.response.data) {
        dispatch(onError(e.response.data))
      } else {
        dispatch(onError(e))
      }
    }
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