import { ADDRESS_REQUEST_INITIATED, ADDRESS_REQUEST_SUCCESS, ADDRESS_REQUEST_FAILED } from '../actionTypes';
import { addresses } from '../intialValues';
import _ from 'lodash';

const addressReducers = (state = addresses, action) => {
  switch(action.type) {
    case ADDRESS_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case ADDRESS_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        values: action.payload,
        error: null
      }
    }
    case ADDRESS_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default : return state;
  }
}

export default addressReducers;