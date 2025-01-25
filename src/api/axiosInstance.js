import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/hrms', // Base URL for the API
  headers: {
    'Content-Type': 'application/json', // Default header
  },
});

// Add a request interceptor for adding authorization token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export default axiosInstance;