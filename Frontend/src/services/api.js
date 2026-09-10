import axios from 'axios';

/**
 * Axios API Client for Landslide Risk Monitoring System
 * 
 * NOTE FOR BEGINNERS:
 * Currently, this frontend uses the mock datasets in /src/data/.
 * When your backend teammate has the FastAPI server running,
 * set VITE_ENABLE_MOCK_DATA=false in your .env file, and Axios
 * will send real HTTP requests to the URL specified in VITE_API_BASE_URL.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const USE_MOCK = import.meta.env.VITE_ENABLE_MOCK_DATA === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to automatically attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ner_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
