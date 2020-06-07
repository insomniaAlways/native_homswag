import { LOCATION_REQUEST_INITIATED, LOCATION_REQUEST_SUCCESS, LOCATION_REQUEST_FAILED, PLACE_REQUEST_INITIATED, PLACE_REQUEST_SUCCESS, PLACE_REQUEST_FAILED } from '../actionTypes';
import _ from 'lodash';

const initialState = {
  isLoading: false,
  error: null,
  values: {}
}
const addressReducers = (state = initialState, action) => {
  switch(action.type) {
    case LOCATION_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    }
    case LOCATION_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        error: null,
        values: {
          ...state.values,
          ...action.payload
        }
      }
    }
    case LOCATION_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    }
    case PLACE_REQUEST_INITIATED: {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case PLACE_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        values: action.payload
      }
    }

    case PLACE_REQUEST_FAILED: {
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