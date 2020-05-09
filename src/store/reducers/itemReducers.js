import { FETCH_ITEMS, ITEM_REQUEST_INITIATED, ITEM_REQUEST_SUCCESS, ITEM_REQUEST_FAILED } from '../actionTypes';
import { items } from '../intialValues';

const itemReducers = (state = items, action) => {
  switch(action.type) {
    case ITEM_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true
      }
    }
    case ITEM_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      }
    }
    case ITEM_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    default : return state;
  }
}

export default itemReducers;