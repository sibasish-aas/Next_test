import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../../api/apiConfig';

const getAuthToken = () => localStorage.getItem('authToken'); 

// Set the Authorization header with the token
const setAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` }; // Include token in Authorization header
  }
  return {};
};

// Fetch all countries
export const fetchCountries = createAsyncThunk('countries/fetchCountries', async () => {
  const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getCountry`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Assuming the API returns the list of countries
});

// Add a new country
export const addCountry = createAsyncThunk('countries/addCountry', async (country) => {
  const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveCountry`, { country }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Returning the added country
});

// Update an existing country
export const updateCountry = createAsyncThunk('countries/updateCountry', async (country) => {
  const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateCountry/${country.countryId}`, { country: country.country }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data; // Returning the updated country
});

// Delete a country
export const deleteCountry = createAsyncThunk('countries/deleteCountry', async (countryId) => {
  await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteCountry/${countryId}`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return countryId; // Returning the countryId of the deleted country
});

const countrySlice = createSlice({
  name: 'countries',
  initialState: { countries: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload;
      })
      .addCase(addCountry.fulfilled, (state, action) => {
        state.countries.push(action.payload);
      })
      .addCase(updateCountry.fulfilled, (state, action) => {
        const index = state.countries.findIndex((c) => c.countryId === action.payload.countryId);
        if (index !== -1) state.countries[index] = action.payload;
      })
      .addCase(deleteCountry.fulfilled, (state, action) => {
        state.countries = state.countries.filter((c) => c.countryId !== action.payload);
      });
  },
});

export default countrySlice.reducer;
