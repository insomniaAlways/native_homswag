import { SESSION_AUTHENTICATED, SESSION_AUTHENTICATING, SESSION_AUTHENTICATION_FAILED, SESSION_UNAUTHENTICATED, SESSION_UNAUTHENTICATING, SESSION_UNAUTHENTICATION_FAILED } from '../actionTypes';
import { session } from '../intialValues';

const sessionReducers = (state = session, action) => {
  switch (action.type) {
    case SESSION_AUTHENTICATING: {
      return {
        ...state,
        isUpdating: true,
        isSessionExpired: false,
        isSessionAuthenticated: false,
        isSessionUnauthenticated: true,
        error: null
      }
    }
    case SESSION_AUTHENTICATED: {
      return {
        ...state,
        isUpdating: false,
        isSessionExpired: false,
        isSessionAuthenticated: true,
        isSessionUnauthenticated: false,
        error: null
      }
    }
    case SESSION_AUTHENTICATION_FAILED: {
      return {
        ...state,
        isUpdating: false,
        isSessionExpired: false,
        isSessionAuthenticated: false,
        isSessionUnauthenticated: true,
        error: null
      }
    }
    case SESSION_UNAUTHENTICATING: {
      return {
        ...state,
        isUpdating: true,
        error: null
      }
    }
    case SESSION_UNAUTHENTICATED: {
      return {
        ...state,
        isUpdating: false,
        isSessionExpired: false,
        isSessionAuthenticated: false,
        isSessionUnauthenticated: true,
        error: null
      }
    }
    case SESSION_UNAUTHENTICATION_FAILED: {
      return {
        ...state,
        isUpdating: false,
        isSessionUnauthenticated: false,
        error: action.error
      }
    }
    default: {
      return state
    };
  }
}

export default sessionReducers;