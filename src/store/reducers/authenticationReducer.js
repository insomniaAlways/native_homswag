import { VALIDATION_INITIATED, VALIDATION_SUCCESS, SIGN_OUT, VALIDATION_FAILED, ON_LOGIN_INITIATED, ON_LOGIN_SUCCESS, ON_LOGIN_FAILED, FETCH_STORED_TOKEN } from '../actionTypes';
import { authModel } from '../intialValues';

const authReducers = (state = authModel, action) => {
  switch (action.type) {
    case FETCH_STORED_TOKEN : {
      return {
        ...state,
        userToken: action.payload.token,
        refreshToken: action.payload.refreshToken,
      }
    }
    case VALIDATION_INITIATED: {
      return {
        ...state,
        isLoading: true,
        isSignOut: true,
        userToken: null,
        refreshToken: null,
        error: null
      };
    }
    case VALIDATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isSignOut: false,
        userToken: action.payload.token,
        refreshToken: action.payload.refresh_token,
        error: null
      };
    }
    case VALIDATION_FAILED: {
      return {
        ...state,
        isLoading: false,
        isSignOut: true,
        userToken: null,
        refreshToken: null,
        error: action.error
      };
    }
    case SIGN_OUT: {
      return {
        isLoading: false,
        isSignOut: true,
        userToken: null,
        refreshToken: null,
        error: null
      };
    }
    case ON_LOGIN_INITIATED: {
      return {
        ...state,
        isLoading: true,
        userToken: null,
        refreshToken: null,
        isSignOut: true,
        error: null
      }
    }
    case ON_LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        userToken: null,
        refreshToken: null,
        isSignOut: true,
        error: null
      }
    }
    case ON_LOGIN_FAILED: {
      return {
        ...state,
        isLoading: false,
        userToken: null,
        refreshToken: null,
        isSignOut: true,
        error: action.error
      }
    }
    default: return state
  }
}

export default authReducers;