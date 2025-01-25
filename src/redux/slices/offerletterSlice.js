import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Function to get the token from local storage
const getAuthToken = () => {
  return localStorage.getItem('authToken'); // Ensure consistency with selectcandidateSlice
};

// Async thunk to save offer letter
export const saveOfferLetter = createAsyncThunk(
  "offerLetter/saveOfferLetter",
  async (offerLetterData, { rejectWithValue }) => {
    const token = getAuthToken();  // Retrieve token from localStorage
    try {
      // Log the data you're passing to the API
      console.log("Offer Letter Data to be saved:", offerLetterData);

      // Send the POST request with headers
      const response = await axios.post(
        "http://localhost:8000/api/hrms/saveofferdetailsofselectedcandidate",
        offerLetterData,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      // Debugging: Log the response to check structure
      console.log("API Response:", response);

      return response.data; 
    } catch (error) {
      console.error("Error saving offer letter:", error.response || error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for handling offer letter saving
const offerLetterSlice = createSlice({
  name: 'offerLetter',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveOfferLetter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveOfferLetter.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Offer letter saved successfully:', action.payload);
      })
      .addCase(saveOfferLetter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save offer letter";
      });
  },
});

// Export the reducer
export default offerLetterSlice.reducer;
