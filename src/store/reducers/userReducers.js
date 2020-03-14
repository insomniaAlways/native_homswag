import { USER_REQUEST_INITIATED, USER_REQUEST_SUCCESS, USER_REQUEST_FAILED, USER_DETAILS_UPDATED} from '../actionTypes';
import { currentUser } from '../intialValues';
const userReducers = (state=currentUser, action) => {
  switch (action.type) {
    case USER_REQUEST_INITIATED: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case USER_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        values: action.payload,
        error: null
      }
    }
    case USER_DETAILS_UPDATED: {
      return {
        ...state,
        isLoading: false,
        values: action.payload,
        error: null
      }
    }
    case USER_REQUEST_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default: return state;
  }
}

export default userReducers;