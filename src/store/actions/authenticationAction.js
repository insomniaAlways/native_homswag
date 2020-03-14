import { VALIDATION_INITIATED,
  VALIDATION_SUCCESS,
  SIGN_OUT,
  VALIDATION_FAILED,
  ON_LOGIN_INITIATED,
  ON_LOGIN_SUCCESS,
  ON_LOGIN_FAILED } from '../actionTypes';
import { createRecord, initializeAxiosHeader } from '../asyncActions/index';

export const register = (phone) => {
  return function(dispatch) {
    dispatch(loginInitiated())
    return createRecord('login', { phone: phone })
    .then(() => dispatch(onLoginSuccess()))
    .catch(e => dispatch(onLoginFailed(e.response.data)))
  }
}

export const loginInitiated = () => {
  return {
    type: ON_LOGIN_INITIATED
  }
}

export const onLoginSuccess = () => {
  return {
    type: ON_LOGIN_SUCCESS
  }
}

export const onLoginFailed = (error) => {
  return {
    type: ON_LOGIN_FAILED,
    error: error
  }
}

export const validateToken = (phone, otp) => {
  return async function(dispatch) {
    dispatch(onValidationStart())
    return createRecord('me/validate', {phone: phone, otp: otp})
    .then((res) => {
      if(res && res.data && res.data.token) {
        dispatch(addHeader(res.data.token))
        return dispatch(onValidationSuccess(res.data))
      }
    })
    .catch(e => dispatch(onValidationError(e.response.data)))
  }
}

export const addHeader = (token) => {
  return function() {
    return initializeAxiosHeader(token)
  }
}

export const onValidationStart = () => {
  return {
    type: VALIDATION_INITIATED,
  }
}

export const onValidationSuccess = (payload) => {
  return {
    type: VALIDATION_SUCCESS,
    payload: payload
  }
}

export const onValidationError = (error) => {
  return {
    type: VALIDATION_FAILED,
    error: error
  }
}

export const onSigout = () => {
  return {
    type: SIGN_OUT
  }
}

export const validatedAuthToken = (authToken, refreshToken) => {
  return function (dispatch) {
    dispatch(onValidationStart())
    return createRecord('token', {token: authToken, refresh_token: refreshToken})
    .then((res) => {
      if(res && res.data && res.data.token) {
        dispatch(addHeader(res.data.token))
        return dispatch(onValidationSuccess(res.data))
      }
    })
    .catch(e => dispatch(onValidationError(e.response.data)))
  }
}