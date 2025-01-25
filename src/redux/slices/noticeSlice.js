import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { noticeApi } from '../../api/noticeApi';

// Define thunk for saving a job notice
export const saveJobNotice = createAsyncThunk(
  'notices/saveJobNotice',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await noticeApi.saveJobNotice(formData);
      return response; // Return response to handle in Redux slice
    } catch (error) {
      return rejectWithValue(error); // Pass the error for handling in the slice
    }
  }
);

// Fetch notices thunk
export const fetchNotices = createAsyncThunk(
  'notices/fetchNotices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await noticeApi.getAllNotices();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch notices');
    }
  }
);

// Update notice thunk
export const updateJobNotice = createAsyncThunk(
  'notices/updateJobNotice',
  async (noticeData, { dispatch, rejectWithValue }) => {
    try {
      const response = await noticeApi.updateJobNotice(noticeData);
      if (response) {
        console.log('Response:', response);
      }
      await dispatch(fetchNotices());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

// Add new updateNoticeStatus thunk
export const updateNoticeStatus = createAsyncThunk(
  'notices/updateStatus',
  async ({ jobNoticeId, feedback, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await noticeApi.updateNoticeStatus({
        jobNoticeId,
        feedback,
        status,
      });

      if (!response.success) {
        return rejectWithValue(response.message || 'Status update failed');
      }

      await dispatch(fetchNotices());
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Status update failed');
    }
  }
);

const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    items: [],
    selectedNotice: null,
    loading: false,
    error: null,
    updateSuccess: false,
    // Form state added here
    formData: {
      jobTitle: '',
      description: '',
      publishDate: '',
      expiryDate: '',
      jobCategory: '',
      noOfPositions: '',
      feedback: '',
    },
    errors: {},
  },
  reducers: {
    // Notice-related reducers
    setSelectedNotice: (state, action) => {
      state.selectedNotice = action.payload;
    },
    clearSelectedNotice: (state) => {
      state.selectedNotice = null;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    // Form-related reducers
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetFormData: (state) => {
      state.formData = {
        jobTitle: '',
        description: '',
        publishDate: '',
        expiryDate: '',
        jobCategory: '',
        noOfPositions: '',
        feedback: '',
      };
      state.errors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notices cases
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update job notice cases
      .addCase(updateJobNotice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateJobNotice.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;

        if (action.payload.data) {
          const updatedNotice = action.payload.data;
          state.items = state.items.map((notice) =>
            notice.jobNoticeId === updatedNotice.jobNoticeId ? updatedNotice : notice
          );
        }
      })
      .addCase(updateJobNotice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      // Update notice status cases
      .addCase(updateNoticeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateNoticeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        state.error = null;

        if (action.payload.data) {
          const updatedNotice = action.payload.data;
          state.items = state.items.map((item) =>
            item.jobNoticeId === updatedNotice.jobNoticeId ? updatedNotice : item
          );

          if (state.selectedNotice?.jobNoticeId === updatedNotice.jobNoticeId) {
            state.selectedNotice = updatedNotice;
          }
        }
      })
      .addCase(updateNoticeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      });
  },
});

export const {
  setSelectedNotice,
  clearSelectedNotice,
  resetUpdateSuccess,
  setFormData,
  setErrors,
  resetFormData,
} = noticeSlice.actions;

export default noticeSlice.reducer;
