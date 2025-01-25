// interviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleInterviewApi, rescheduleInterviewApi,fetchInterviewRoundDataApi } from '../../../api/interviewApi';

// Async thunk for scheduling interview
export const scheduleInterview = createAsyncThunk(
  'interviews/scheduleInterview',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await scheduleInterviewApi(formData);
      return response; // Success response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for rescheduling interview
export const rescheduleInterview = createAsyncThunk(
  'interviews/rescheduleInterview',
  async ({ applicantId, formData }, { rejectWithValue }) => {
    try {
      const response = await rescheduleInterviewApi(applicantId, formData);
      return response; // Success response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Async thunk for rescheduling interview
export const fetchInterviewRoundData = createAsyncThunk(
  'interviews/fetchinterviewrounddata',
  async ({ applicantDetails}, { rejectWithValue }) => {
    try {
      const response = await fetchInterviewRoundDataApi(applicantDetails);// error show here 
      return response; // Success response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state for the slice
const initialState = {
  interviewData: [],//form data for edit and create
  interviewRoundData:[],//interview result data
  status: 'idle', // can be 'idle', 'loading', 'succeeded', 'failed'
  error: null,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    resetInterviewData: (state) => {
      state.interviewData = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scheduleInterview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interviewData = action.payload;
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(rescheduleInterview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(rescheduleInterview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interviewData = action.payload;
      })
      .addCase(rescheduleInterview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle the interview round data fetching
      .addCase(fetchInterviewRoundData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInterviewRoundData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interviewRoundData = action.payload; // Store the interview round data here
      })
      .addCase(fetchInterviewRoundData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetInterviewData } = interviewSlice.actions;

export default interviewSlice.reducer;
