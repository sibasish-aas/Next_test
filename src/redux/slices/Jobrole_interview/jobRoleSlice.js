import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../../api/apiConfig';


const getAuthToken = () => localStorage.getItem('authToken'); // Assuming it's stored in localStorage

// Set the Authorization header with the token
const setAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` }; // Include token in Authorization header
  }
  return {};
};

// Fetch all job roles
export const fetchJobRoles = createAsyncThunk('jobRoles/fetchJobRoles', async () => {
  const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getAllJobRoles`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Assuming the API returns the list of job roles
});

// Add a new job role
export const addJobRole = createAsyncThunk('jobRoles/addJobRole', async (jobRole) => {
  const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveJobRole`, { jobRole }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  console.log(response,'');
  
  return response.data; // Returning the added job role
});

// Update an existing job role
export const updateJobRole = createAsyncThunk('jobRoles/updateJobRole', async (jobRole) => {
  const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateJobRole/${jobRole.jobRoleId}`, { jobRole: jobRole.jobRole }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Returning the updated job role
});

// Delete a job role
export const deleteJobRole = createAsyncThunk('jobRoles/deleteJobRole', async (jobRoleId) => {
  await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteJobRole/${jobRoleId}`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return jobRoleId; // Returning the jobRoleId of the deleted job role
});

const jobRoleSlice = createSlice({
  name: 'jobRoles',
  initialState: { jobRoles: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobRoles.fulfilled, (state, action) => {
        state.jobRoles = action.payload;
      })
      .addCase(addJobRole.fulfilled, (state, action) => {
        state.jobRoles.push(action.payload);
      })
      .addCase(updateJobRole.fulfilled, (state, action) => {
        const index = state.jobRoles.findIndex((j) => j.jobRoleId === action.payload.jobRoleId);
        if (index !== -1) state.jobRoles[index] = action.payload;
      })
      .addCase(deleteJobRole.fulfilled, (state, action) => {
        state.jobRoles = state.jobRoles.filter((j) => j.jobRoleId !== action.payload);
      });
  },
});

export default jobRoleSlice.reducer;
