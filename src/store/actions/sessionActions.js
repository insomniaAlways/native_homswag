import { SESSION_AUTHENTICATED, SESSION_AUTHENTICATING, SESSION_AUTHENTICATION_FAILED, SESSION_UNAUTHENTICATED, SESSION_UNAUTHENTICATION_FAILED, SESSION_UNAUTHENTICATING } from '../actionTypes';
import AsyncStorage from '@react-native-community/async-storage';

export const setSessionAuthenticated = (authToken, refreshToken) => {
  return async function(dispatch) {
    try {
      let tokenObject = JSON.stringify({
        authToken: authToken,
        refreshToken: refreshToken
      })
      dispatch(settingSessionAuthenticating())
      await AsyncStorage.setItem('token', tokenObject)
      return dispatch(setSessionAuthenticatedSuccess(authToken))
    } catch (error) {
      return dispatch(setSessionAuthenticationFailed(error))
    }
  }
}

const setSessionAuthenticatedSuccess = (authToken) => {
  return {
    type: SESSION_AUTHENTICATED,
    token: authToken
  }
}

const settingSessionAuthenticating = () => {
  return {
    type: SESSION_AUTHENTICATING,
  }
}

const setSessionAuthenticationFailed = (error) => {
  return {
    type: SESSION_AUTHENTICATION_FAILED,
    isAuthenticating: false,
    error: error
  }
}

export const setSessionUnauthenticated = () => {
  return async function(dispatch) {
    try {
      dispatch(setSessionUnauthenticating())
      await AsyncStorage.removeItem('token')
      return dispatch(setSessionUnauthenticatSuccess())
    } catch (error) {
      return dispatch(setSessionUnauthenticatFailed(error))
    }
  }
}

const setSessionUnauthenticating = () => {
  return {
    type: SESSION_UNAUTHENTICATING
  }
}

const setSessionUnauthenticatSuccess = () => {
  return {
    type: SESSION_UNAUTHENTICATED,
  }
}

const setSessionUnauthenticatFailed= (error) => {
  return {
    type: SESSION_UNAUTHENTICATION_FAILED,
    error: error
  }
}