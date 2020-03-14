import { PACKAGE_REQUEST_INITIATED, PACKAGE_REQUEST_SUCCESS, PACKAGE_REQUEST_FAILED } from '../actionTypes';
import { packages } from '../intialValues';
import _ from 'lodash';

const packageReducers = (state = packages, action) => {
  switch(action.type) {
    case PACKAGE_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true
      }
    }
    case PACKAGE_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      }
    }
    case PACKAGE_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    default : return state;
  }
}

export default packageReducers;