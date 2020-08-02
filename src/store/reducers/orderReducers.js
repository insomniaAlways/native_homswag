import {
  ORDER_REQUEST_INITIATED,
  ORDER_REQUEST_SUCCESS,
  ORDER_REQUEST_FAILED,
  ORDER_CREATE_REQUEST_SUCCESS,
  ORDER_UPDATE,
  SESSION_UNAUTHENTICATED
} from "../actionTypes";
import { orders } from "../intialValues";
import _ from "lodash";

const ordersReducers = (state = orders, action) => {
  switch (action.type) {
    case SESSION_UNAUTHENTICATED: {
      return orders;
    }
    case ORDER_REQUEST_INITIATED: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ORDER_CREATE_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        currentValue: action.payload,
        error: null
      };
    }
    case ORDER_REQUEST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        values: action.payload,
        error: null
      };
    }
    case ORDER_REQUEST_FAILED: {
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    }
    case ORDER_UPDATE: {
      return {
        ...state,
        isLoading: false,
        values: state.values.map((value) => {
          if (value.id == action.payload.id) {
            return {
              ...value,
              status: action.payload.status
            };
          } else {
            return value;
          }
        })
      };
    }
    default:
      return state;
  }
};

export default ordersReducers;
