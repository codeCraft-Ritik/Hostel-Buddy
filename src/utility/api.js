// src/utility/api.js

import axios from "axios";
import { fetchToken } from './jwtLocalStorage.js';

// This is the CRITICAL line. It reads the backend URL from the Vercel environment variable.
const BASE_URL = import.meta.env.VITE_API_URL; 

const getHeaders = () => {
  const token = fetchToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`, // This combines your live URL with the specific endpoint
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