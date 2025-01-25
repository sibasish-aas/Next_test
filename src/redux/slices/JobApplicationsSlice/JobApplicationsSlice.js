import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllJobApplicationsApi,
  fetchAllShortlistedApplicationsApi,
  downloadResumeApi 
} from '../../../api/jobApplicationsApi';

// Initial state
const initialState = {
  jobApplications: [],
  shortlistedApplications: [],
  status: 'idle',
  error: null,
  downloadStatus: 'idle', // Track the download status
  downloadError: null, // Track errors related to download
};

// Async thunks

// Fetch all job applications
export const fetchAllJobApplications = createAsyncThunk(
  'jobapplications/fetchAllJobApplications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllJobApplicationsApi();
      console.log("all data",data)
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Fetch all shortlisted job applications
export const fetchShortlistedJobApplications = createAsyncThunk(
  'jobapplications/fetchShortlistedJobApplications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllShortlistedApplicationsApi();
      //console.log("all shortlisted data",data);
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Async thunk for downloading resume
export const downloadResume = createAsyncThunk(
  'jobapplications/downloadResume',
  async (_, { rejectWithValue }) => {
    try {
      const data = await downloadResumeApi();
      console.log("Resume data", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);


// Slice
const jobApplicationsSlice = createSlice({
  name: 'jobApplication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling fetchAllJobApplications actions
      .addCase(fetchAllJobApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllJobApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobApplications = action.payload;
      })
      .addCase(fetchAllJobApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handling fetchShortlistedJobApplications actions
      .addCase(fetchShortlistedJobApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShortlistedJobApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shortlistedApplications = action.payload;
      })
      .addCase(fetchShortlistedJobApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handling downloadResume actions
      .addCase(downloadResume.pending, (state) => {
        state.downloadStatus = 'loading';
      })
      .addCase(downloadResume.fulfilled, (state, action) => {
        state.downloadStatus = 'succeeded';
        // You can store the downloaded resume data here if needed
      })
      .addCase(downloadResume.rejected, (state, action) => {
        state.downloadStatus = 'failed';
        state.downloadError = action.payload;
      })
  },
});

// Export reducer
export default jobApplicationsSlice.reducer;
