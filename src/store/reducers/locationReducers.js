import { LOCATION_REQUEST_INITIATED, LOCATION_REQUEST_SUCCESS, LOCATION_REQUEST_FAILED, PLACE_REQUEST_INITIATED, PLACE_REQUEST_SUCCESS, PLACE_REQUEST_FAILED } from '../actionTypes';
import _ from 'lodash';

const addressReducers = (state = {}, action) => {
  switch(action.type) {
    case LOCATION_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true
      }
    }
    case LOCATION_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
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
        isLoading: true
      }
    }
    case PLACE_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        values: {
          ...state.values,
          place_url: action.place_url,
          place_id: action.place_id
        }
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