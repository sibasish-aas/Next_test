import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const BASE_URL = API_CONFIG.getBaseUrl();

// Helper function to get token
const getToken = () => localStorage.getItem('token');

export const noticeApi = {
  // create notice
  saveJobNotice: async (formData) => {
    try {
      const token = getToken();
      const response = await axios.post(
        `${BASE_URL}/savejobnotice`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create job notice';
    }
  },

  // Get all notices
  getAllNotices: async () => {
    try {
      const token = getToken();
      const response = await axios.get(`${BASE_URL}/getnoticelist`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      //console.log('API Response:', response);
      
      // Access the nested data array
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      return [];
    } catch (error) {
      //console.error('Error fetching notices:', error);
      throw error;
    }
  },

  // Create new notice
  createNotice: async (noticeData) => {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/getnoticelist`, noticeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Update notice
  updateNotice: async (id, noticeData) => {
    const token = getToken();
    const response = await axios.patch(`${BASE_URL}/updatejobnotice/${id}`, noticeData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Get notice by ID
  getNoticeById: async (id) => {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/getnoticelistbynoticeid/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Update notice status
  updateNoticeStatus: async (noticeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/setjobpostingstatus/${noticeData.jobNoticeId}`,
        {
          jobNoticeId: noticeData.jobNoticeId,
          feedback: noticeData.feedback,
          status: noticeData.status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update status';
    }
  },

  updateJobNotice: async (noticeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${BASE_URL}/updatejobnotice/${noticeData.jobNoticeId}`,
        noticeData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update notice';
    }
  }
};