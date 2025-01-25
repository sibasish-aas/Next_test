import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchInterviewsApi, submitApplicantFeedbackApi } from '@/api/interviewerApi';

// Fetch interviews
export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchInterviewsApi();
      return response; // Return the response data if successful
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Return the error message if failed
    }
  }
);

// Submit applicant feedback (feedbackArray contains the list of feedback data)
export const submitFeedback = createAsyncThunk(
  'interviews/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await submitApplicantFeedbackApi(feedbackData);
      return response; // Return the response containing feedback data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message); // Return the error message if failed
    }
  }
);

// Slice for managing interviews and feedback state
const interviewsSlice = createSlice({
  name: 'interviews',
  initialState: {
    // State for fetching interviews
    interviews: {}, // Use an object for faster lookups
    interviewsStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    interviewsError: null,

    // State for submitting feedback
    submitFeedbackStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    submitFeedbackError: null,

    // New state to store feedback submissions
    submittedFeedback: [], // Array to store the feedback submissions
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch interviews
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.interviewsStatus = 'loading';
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.interviewsStatus = 'succeeded';
        state.interviews = action.payload.reduce((acc, interview) => {
          acc[interview.id] = interview; // Convert to an object for faster access
          return acc;
        }, {}); // Store fetched interviews as an object
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.interviewsStatus = 'failed';
        state.interviewsError = action.payload; // Store the error message
      });

    // Submit feedback (feedbackArray is the list of feedbacks to be submitted)
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.submitFeedbackStatus = 'loading';
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.submitFeedbackStatus = 'succeeded';

        // Store all feedback data into the submittedFeedback array
        state.submittedFeedback = [...state.submittedFeedback, ...action.payload];

        // Update interviews with new feedback
        action.payload.forEach((feedback) => {
          const interview = state.interviews[feedback.interviewId];
          if (interview) {
            interview.feedback = feedback.feedbackData; // Assuming feedback.feedbackData exists
          } else {
            console.warn(`Interview with id ${feedback.interviewId} not found`);
          }
        });
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.submitFeedbackStatus = 'failed';
        state.submitFeedbackError = action.payload; // Store the error message
      });
  },
});

export default interviewsSlice.reducer;
