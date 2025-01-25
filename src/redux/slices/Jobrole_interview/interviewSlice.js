// interviewSlice.js
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

// Fetch all interview rounds
export const fetchInterviewRounds = createAsyncThunk('interviewRounds/fetchInterviewRounds', async () => {
  const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getInterviewRoundlist`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Assuming the API returns the list of interview rounds
});

// Add a new interview round
export const addInterviewRound = createAsyncThunk('interviewRounds/addInterviewRound', async ({ roundName, jobRoleId }) => {
    console.log('Adding interview round:', { roundName, jobRoleId });
  const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveInterviewRound`, { roundName, jobRoleId }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Returning the added interview round
});

// Update an existing interview round
export const updateInterviewRound = createAsyncThunk('interviewRounds/updateInterviewRound', async (interviewRound) => {
  const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateInterviewRound/${interviewRound.roundId}`, { roundName: interviewRound.roundName }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Returning the updated interview round
});

// Delete an interview round
export const deleteInterviewRound = createAsyncThunk('interviewRounds/deleteInterviewRound', async (roundId) => {
  await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteInterviewRound/${roundId}`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return roundId; // Returning the roundId of the deleted interview round
});

const interviewRoundSlice = createSlice({
  name: 'interviewRounds',
  initialState: { interviewRounds: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviewRounds.fulfilled, (state, action) => {
        state.interviewRounds = action.payload;
      })
      .addCase(addInterviewRound.fulfilled, (state, action) => {
        state.interviewRounds.push(action.payload);
      })
      .addCase(updateInterviewRound.fulfilled, (state, action) => {
        const index = state.interviewRounds.findIndex((interviewRound) => interviewRound.roundId === action.payload.roundId);
        if (index !== -1) {
          state.interviewRounds[index] = action.payload;
        }
      })
      .addCase(deleteInterviewRound.fulfilled, (state, action) => {
        state.interviewRounds = state.interviewRounds.filter((interviewRound) => interviewRound.roundId !== action.payload);
      });
  },
});

export default interviewRoundSlice.reducer;
