/**
 * API utility functions for making HTTP requests
 */
import { API_BASE_URL, API_ENDPOINTS } from './constants';
import { STORAGE_KEYS } from './constants';

/**
 * Constructs request headers with authentication if token exists
 * @returns {Object} Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Handles API response and errors
 * @param {Response} response - Fetch response object
 * @returns {Promise} Parsed response data
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data.error || data.message || 'Unknown error occurred';
    throw new Error(error);
  }
  
  return data;
};

/**
 * Makes a GET request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} queryParams - Query parameters
 * @returns {Promise} Response data
 */
export const apiGet = async (endpoint, queryParams = {}) => {
  try {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    // Add query parameters
    if (Object.keys(queryParams).length) {
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] !== undefined && queryParams[key] !== null) {
          url.searchParams.append(key, queryParams[key]);
        }
      });
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
};

/**
 * Makes a POST request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise} Response data
 */
export const apiPost = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
};

/**
 * Makes a PUT request to the API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise} Response data
 */
export const apiPut = async (endpoint, data = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('API PUT Error:', error);
    throw error;
  }
};

/**
 * Makes a DELETE request to the API
 * @param {string} endpoint - API endpoint
 * @returns {Promise} Response data
 */
export const apiDelete = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('API DELETE Error:', error);
    throw error;
  }
};

/**
 * API service object with convenience methods for common endpoints
 */
export const apiService = {
  // Health check
  checkHealth: () => apiGet(API_ENDPOINTS.HEALTH),
  
  // Token info
  getTokenInfo: () => apiGet(API_ENDPOINTS.TOKEN_INFO),
  
  // Marketplace
  getMarketplaceItems: (params = {}) => apiGet(API_ENDPOINTS.MARKETPLACE, params),
  getMarketplaceItem: (id) => apiGet(`${API_ENDPOINTS.MARKETPLACE}/${id}`),
  
  // Add more API methods as needed
}; 