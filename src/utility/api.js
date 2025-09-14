import axios from "axios";
import { fetchToken } from './jwtLocalStorage.js';

const getHeaders = () => {
  const token = fetchToken();
  // If a token exists, return the Authorization header, otherwise return empty object
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `/api/v1${url}`, 
      data,
      params,
      headers: getHeaders(), 
    };
    const response = await axios(config);
    return response.data;
  } catch (err) {
    console.error(`Error ${method}ing data to ${url}:`, err);
   
    throw err;
  }
};

export const getDataFromApi = (url, params) => apiRequest('get', url, null, params);
export const postDataFromApi = (url, body) => apiRequest('post', url, body);
export const deleteDataFromApi = (url, params) => apiRequest('delete', url, null, params);
export const putDataFromApi = (url, body, params) => apiRequest('put', url, body, params);
export const patchDataFromApi = (url, body, params) => apiRequest('patch', url, body, params);