import {
  REFERRAL_REQUEST_INITIATED,
  REFERRAL_REQUEST_SUCCEED,
  REFERRAL_REQUEST_FAILED
} from '../actionTypes';
import {
  referral
} from '../intialValues';

const referralReducers = (state = referral, action) => {
  switch (action.type) {
    case REFERRAL_REQUEST_INITIATED: {
      return {
        ...state,
        isLoading: true
      }
    }
    case REFERRAL_REQUEST_SUCCEED: {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      }
    }
    case REFERRAL_REQUEST_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default:
      return state;
  }
}

export default referralReducers;