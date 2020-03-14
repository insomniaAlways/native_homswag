import { NETWORK_AVAIABLE, NETWORK_UNAVAIABLE } from '../actionTypes';

export const onNetworkAvailable = () => {
  return {
    type: NETWORK_AVAIABLE
  }
}

export const onNetworkUnAvailable = () => {
  return {
    type: NETWORK_UNAVAIABLE
  }
}