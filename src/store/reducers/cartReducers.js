import {
  CART_REQUEST_INITIATED,
  CART_REQUEST_SUCCESS,
  CART_REQUEST_FAILED,
  SESSION_UNAUTHENTICATED
} from "../actionTypes";
import { categories } from "../intialValues";

const cartReducers = (state = categories, action) => {
  switch (action.type) {
    case SESSION_UNAUTHENTICATED: {
      return categories;
    }
    case CART_REQUEST_INITIATED: {
      return {
        ...state,
        isLoading: true
      };
    }
    case CART_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        values: action.payload
      };
    }
    case CART_REQUEST_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    }
    default:
      return state;
  }
};

export default cartReducers;
