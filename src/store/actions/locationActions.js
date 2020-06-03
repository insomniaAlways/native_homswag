import { LOCATION_REQUEST_INITIATED, LOCATION_REQUEST_SUCCESS, LOCATION_REQUEST_FAILED, PLACE_REQUEST_INITIATED, PLACE_REQUEST_SUCCESS, PLACE_REQUEST_FAILED, } from '../actionTypes';
import { getLocationDetails, getPlaceDetails } from '../asyncActions/index';

export const geoCoding = (latitude, longitude) => {
  return function(dispatch) {
    dispatch(fetchLocationInitiated())
    return getLocationDetails(latitude, longitude)
    .then(({data}) => {
      return dispatch(getPlace({
        formatted_address: data.results[0].formatted_address,
        place_id: data.results[0].place_id,
        coordinate: {latitude: data.results[0].geometry.location.lat, longitude: data.results[0].geometry.location.lng}
      }))
    })
    .catch((e) => dispatch(fetchLocationFailed(e)))
  }
}

export const fetchLocationInitiated = () => {
  return {
    type: LOCATION_REQUEST_INITIATED
  }
}

export const fetchLocationSuccess = (payload) => {
  return {
    type: LOCATION_REQUEST_SUCCESS,
    payload: payload
  }
}

export const fetchLocationFailed = (payload) => {
  return {
    type: LOCATION_REQUEST_FAILED,
    error: payload
  }
}

export const getPlace = (data) => {
  return function(dispatch) {
    dispatch(fetchPlaceInitiated())
    return getPlaceDetails(data.place_id)
    .then((res) => dispatch(fetchPlaceSuccess(res.data, data)))
    .catch((e) => dispatch(fetchPlaceFailed(e)))
  }
}

function fetchPlaceInitiated() {
  return {
    type: PLACE_REQUEST_INITIATED
  }
}

function fetchPlaceSuccess(payload, data) {
  return {
    type: PLACE_REQUEST_SUCCESS,
    payload: {
      place_url: payload.result.url,
      place_id: payload.result.place_id,
      formatedAddress: data.formatted_address,
      coordinate: data.coordinate
    }
  }
}

function fetchPlaceFailed(error) {
  return {
    type: PLACE_REQUEST_FAILED,
    error: error
  }
}
