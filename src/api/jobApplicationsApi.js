
//import axiosInstance from './axiosInstance';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.134:8082/api/hrms', // Base URL for the API
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



// Helper function to get the token from localStorage or another source
const token = () => {
  return localStorage.getItem('token');  // Adjust based on where you store the token
};



// Fetch all job Applications applications
export const fetchAllJobApplicationsApi = async () => {
    const response = await axiosInstance.get('/getapplicantdetails', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("All Job  Applicant data is : ",response.data)
    return response.data;
  };

// Fetch all job fetchAllShortlistedApplicationsApi 
export const fetchAllShortlistedApplicationsApi = async () => {
    const response = await axiosInstance.get('/getshortlistedapplicantdetails', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("The Shortlisted Applications data is : ",response.data)
    return response.data;
  };


  
  //download resume api
export const downloadResumeApi = async (applicantId) => {
    const response = await axiosInstance.get(`/download/${applicantId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Resume downloading... ",response.data)
    return response.data;
  };
