import { CARTITEM_REQUEST_INITIATED, CARTITEM_REQUEST_SUCCESS, CARTITEM_REQUEST_FAILED, MERGE_CARTITEMS, CARTITEM_CREATE_SUCCESS, CARTITEM_DELETE_SUCCESS, CARTITEM_UPDATE_SUCCESS } from '../actionTypes';
import { cartItems } from '../intialValues';
import _ from 'lodash';

const cartItemReducers = (state = cartItems, action) => {
  switch(action.type) {
    case CARTITEM_REQUEST_INITIATED : {
      return {
        ...state,
        isLoading: true,
        error: null
      }
    }
    case CARTITEM_REQUEST_SUCCESS : {
      return {
        ...state,
        isLoading: false,
        values: action.payload,
        error: null
      }
    }
    case CARTITEM_REQUEST_FAILED : {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    }
    case CARTITEM_CREATE_SUCCESS: {
      let values = state.values.slice()
      values.splice(values.length, 0, action.payload)
      return {
        ...state,
        isLoading: false,
        values: values,
        error: null
      }
    }
    case CARTITEM_DELETE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        values: state.values.filter((cartItem) => cartItem.id != action.payload),
        error: null
      }
    }
    case CARTITEM_UPDATE_SUCCESS: {
      let values = state.values.slice()
      let updatedValues = values.map((value) => {
        if(value.id == action.payload.id) {
          return {
            ...value,
            ...action.payload,
            quantity: action.payload.quantity
          }
        } else {
          return value
        }
      })
      return {
        ...state,
        isLoading: false,
        values: updatedValues,
        error: null
      }
    }
    default : return state;
  }
}

export default cartItemReducers;