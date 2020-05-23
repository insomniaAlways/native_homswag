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
    .catch(e => {
      if(e && e.response && e.response.data) {
        return dispatch(onLoginFailed(e.response.data))
      } else {
        return dispatch(onLoginFailed(e))
      }
    })
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
  return async (dispatch) => {
    try {
      dispatch(onValidationStart())
      let res = await createRecord('me/validate', {phone: phone, otp: otp})
      if(res && res.data && res.data.token) {
        dispatch(addHeader(res.data.token))
        return dispatch(onValidationSuccess(res.data))
      }
    } catch (e) {
      if(e && e.response && e.response.data) {
        dispatch(onValidationError(e.response.data))
      } else {
        dispatch(onValidationError(e))
      }
    }
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
  return async (dispatch) => {
    try {
      dispatch(onValidationStart())
      let res = await createRecord('token', {token: authToken, refresh_token: refreshToken})
      if(res && res.data && res.data.token) {
        dispatch(addHeader(res.data.token))
        return dispatch(onValidationSuccess(res.data))
      }
    } catch (e) {
      if(e && e.response && e.response.data) {
        dispatch(onValidationError(e.response.data))
      } else {
        dispatch(onValidationError(e))
      }
    }
  }
}