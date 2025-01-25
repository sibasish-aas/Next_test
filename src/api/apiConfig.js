const getBaseUrl = () => {
  // Check if we're running in network mode
  const isNetworkMode = process.env.NEXT_PUBLIC_NETWORK_MODE === 'true';
  
  // Use the same host as the frontend
  //const host = isNetworkMode ? '192.168.42.186' : 'localhost';
  const host = 'localhost';
  return `http://${host}:8000/api/hrms`;
};

export const API_CONFIG = {
  getBaseUrl,
  timeout: 10000, // 10 seconds timeout
  withCredentials: true // Enable credentials for cross-origin requests
};

export default API_CONFIG;
