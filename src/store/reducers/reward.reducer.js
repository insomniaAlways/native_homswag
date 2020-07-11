import { REWARD_REQUEST_INITIATED, REWARD_REQUEST_SUCCEED, REWARD_REQUEST_FAILED } from '../actionTypes';
import { rewards } from '../intialValues';

const rewardReducers = (state = rewards, action) => {
  switch(action.type) {
    case REWARD_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true
      }
    }
    case REWARD_REQUEST_SUCCEED : {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      }
    }
    case REWARD_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default : return state;
  }
}

export default rewardReducers;