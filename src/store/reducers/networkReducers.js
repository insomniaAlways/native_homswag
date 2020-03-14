import { NETWORK_AVAIABLE, NETWORK_UNAVAIABLE } from '../actionTypes';
import { networkAvailability } from '../intialValues';

const networkReducers = (state = networkAvailability, action) => {
  switch (action.type) {
    case NETWORK_AVAIABLE: {
      return {
        ...state,
        isOffline: false
      }
    }
      break;
    case NETWORK_UNAVAIABLE: {
      return {
        ...state,
        isOffline: true
      }
    }
    default: {
      return {
        ...state,
        isOffline: false
      }
    }
  }
}

export default networkReducers;