import axios from 'axios';
// const host = "http://192.168.0.105:1337/api/v1/";
const host = "https://homswag.herokuapp.com/api/v1";
export const organization = "organization_id=2"
import Constants from 'expo-constants';

const axiosInstance = axios.create({
  baseURL: host
});

const createErrorObject = (error, message="Something went wrong") => {
  return {
    error: error,
    message: message
  }
}

export const initializeAxiosHeader = (token) => {
  try {
    if(token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } 
  catch (e) {
    return createErrorObject(e, "Header not added")
  }
}

//GET Calls
export function findAll(type, query) {
  let url = `/${type}`;
  if(query) {
    url = `${url}?${query}&${organization}`
  } else {
    url = `${url}?${organization}`
  }
  return getRecord(url)
}

export function query(type, query) {
  let url = `/${type}`;
  if(query) {
    url = `${url}?${query}&${organization}`
  } else {
    url = `${url}?${organization}`
  }
  return getRecord(url)
}

export function findRecord(type, id) {
  let url = `/${type}`;
  if(id) {
    url = `${url}/${id}`
  } else {
    url = `${url}`
  }
  return getRecord(url)
}

//Making GET call
function getRecord(url) {
  return axiosInstance.get(url)
}

//POST Calls
export function createRecord(type, payload) {
  return axiosInstance.post(type, payload)
}

//PUT Calls
export function updateRecord(type, id, payload) {
  let url
  if(id) {
    url = `${type}/${id}`
  } else {
    url = `${type}`
  }
  return axiosInstance.put(url, payload)
}

//DELETE Calls
export function deleteRecord(type, id, payload) {
  let url = `${type}/${id}`
  return axiosInstance.delete(url)
}

export function getLocationDetails(latitude, longitude) {
  let key = Constants.manifest.extra.webAPIKey
  return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${key}`)
}

export function getPlaceDetails(place_id) {
  let key = Constants.manifest.extra.webAPIKey
  return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${key}`)
}

export default axiosInstance;