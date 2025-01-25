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

export const fetchStates = createAsyncThunk('states/fetchStates', async () => {
    const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getAllState`, {
      headers: setAuthHeaders(),  // Include token in headers
    });
    return response.data; // Assuming the API returns the list of countries
  });
  
// Add a new country
export const addState = createAsyncThunk('states/addState', async ({ state, countryId }) => {
    const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveState`, { state, countryId }, {
      headers: setAuthHeaders(),  // Include token in headers
    });
    return response.data; // Returning the added country
  });

// // Update an existing state
// export const updateState = createAsyncThunk('states/updateState', async ({ stateId, state }) => {
//   const response = await axios.put(`/api/hrms/updateState?stateId=${stateId}`, { state });
//   return response.data;
// });
// Update an existing country
export const updateState = createAsyncThunk('states/updateState', async (state) => {
    const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateState/${state.stateId}`, { state: state.state }, {
      headers: setAuthHeaders(),  // Include token in headers
    });
    return response.data; // Returning the updated country
  });
// Delete a state (soft delete)
// export const deleteState = createAsyncThunk('states/deleteState', async (stateId) => {
//   const response = await axios.delete(`/api/hrms/deleteState?stateId=${stateId}`);
//   return stateId;
// });
// Delete a country
export const deleteState = createAsyncThunk('states/deleteState', async (stateId) => {
    await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteState/${stateId}`, {
      headers: setAuthHeaders(),  // Include token in headers
    });
    return stateId; // Returning the countryId of the deleted country
  });
const stateSlice = createSlice({
  name: 'states',
  initialState: { states: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload;
      })
      .addCase(addState.fulfilled, (state, action) => {
        state.states.push(action.payload);
      })
      .addCase(updateState.fulfilled, (state, action) => {
        const index = state.states.findIndex((state) => state.stateId === action.payload.stateId);
        if (index !== -1) {
          state.states[index] = action.payload;
        }
      })
      .addCase(deleteState.fulfilled, (state, action) => {
        state.states = state.states.filter((state) => state.stateId !== action.payload);
      });
  },
});

export default stateSlice.reducer;
