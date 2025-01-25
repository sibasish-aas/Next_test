import axios from 'axios';
import { API_CONFIG } from './apiConfig';

const BASE_URL = API_CONFIG.getBaseUrl();

export const createJobApi = {
  getNoticeById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getnoticelistbynoticeid/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getJobList: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getJobList`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSkills: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getSkillList`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getJobRoles: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getAllJobRoles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInterviewRounds: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/getInterviewRoundlist`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInterviewRoundsByRole: async (jobRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/interviewRounds/${jobRole}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  saveJob: async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      const formattedData = {
        ...jobData,
        skills: Array.isArray(jobData.skills) ? jobData.skills : [jobData.skills],
        interviewRounds: Array.isArray(jobData.interviewRounds) ? jobData.interviewRounds : [jobData.interviewRounds]
      };

      const response = await axios.post(`${BASE_URL}/savejob`, formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateJob: async (jobId, jobData) => {
    try {
      const token = localStorage.getItem('token');
      
      // Make sure interviewRounds is an array of indices
      const formattedData = {
        ...jobData,
        skills: Array.isArray(jobData.skills) ? jobData.skills : [jobData.skills],
        interviewRounds: Array.isArray(jobData.interviewRounds) ? jobData.interviewRounds : []
      };

      console.log('Sending update with formatted data:', formattedData);

      const response = await axios.put(`${BASE_URL}/updatejob/${jobId}`, formattedData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error.response?.data || error.message);
      throw error.response?.data || error.message;
    }
  },

  deleteJob: async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${BASE_URL}/deletejob/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};