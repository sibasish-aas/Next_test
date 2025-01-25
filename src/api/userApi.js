import axios from 'axios';
import axiosInstance from './axiosInstance';

const token = localStorage.getItem('token');

const userApi = {
  // Fetch all users
  fetchAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/fetchAllUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await axiosInstance.patch(`/updateUser/${id}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete user (mark as deleted)
  deleteUser: async (id) => {
    try {
      const response = await axiosInstance.patch(`/deleteUser/${id}`, { isDeleted: true },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add new user
  addUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user profile
  updateProfile: async (id, profileData) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}/profile`, profileData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change user password
  changePassword: async (id, passwordData) => {
    try {
      const response = await axiosInstance.post(`/users/${id}/change-password`, passwordData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default userApi;