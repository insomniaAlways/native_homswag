import { CATEGORY_REQUEST_INITIATED, CATEGORY_REQUEST_SUCCESS, CATEGORY_REQUEST_FAILED } from '../actionTypes';
import { categories } from '../intialValues';

const categoryReducers = (state = categories, action) => {
  switch(action.type) {
    case CATEGORY_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true
      }
    }
    case CATEGORY_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      }
    }
    case CATEGORY_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    default : return state;
  }
}

export default categoryReducers;