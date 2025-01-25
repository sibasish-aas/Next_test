import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createJobApi } from '../../api/createJobApi';

// Async thunks
export const fetchSkills = createAsyncThunk(
  'job/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getSkills();
      console.log('Skills API Response:', response);
      return response.skills || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchJobRoles = createAsyncThunk(
  'job/fetchJobRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getJobRoles();
      console.log('Job Roles API Response:', response);
      return response || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchInterviewRounds = createAsyncThunk(
  'job/fetchInterviewRounds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getInterviewRounds();
      console.log('Interview Rounds API Response:', response);
      return response || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchJobList = createAsyncThunk(
  'job/fetchJobList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getJobList();
      console.log('Job List API Response:', response);
      return response.jobs || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getJobList();
      console.log('Jobs API Response:', response);
      return response.jobs || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const saveJob = createAsyncThunk(
  'job/saveJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await createJobApi.saveJob(jobData);
      console.log('Save Job API Response:', response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNoticeById = createAsyncThunk(
  'notice/fetchNoticeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await createJobApi.getNoticeById(id);
      console.log('Notice By Id API Response:', response);
      return response || {};
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await createJobApi.updateJob(jobId, jobData);
      console.log('Update Job API Response:', response);
      return { jobId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await createJobApi.deleteJob(jobId);
      return jobId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  jobs: [],
  loading: {
    jobs: false,
    update: false
  },
  error: null,
  updateError: null,
  skills: [],
  jobRoles: [],
  interviewRounds: [],
  noticeData: null,
  jobList: [],
  selectedNotice: null
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    resetState(state) {
      state.error = null;
      state.updateError = null;
      state.loading = {
        jobs: false,
        update: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Job List
      .addCase(fetchJobList.pending, (state) => {
        state.loading.jobList = true;
        state.error = null;
      })
      .addCase(fetchJobList.fulfilled, (state, action) => {
        state.loading.jobList = false;
        state.jobList = action.payload;
        state.error = null;
      })
      .addCase(fetchJobList.rejected, (state, action) => {
        state.loading.jobList = false;
        state.error = action.payload;
      })

      // Notice data
      .addCase(fetchNoticeById.pending, (state) => {
        state.loading.notice = true;
        state.error = null;
      })
      .addCase(fetchNoticeById.fulfilled, (state, action) => {
        state.loading.notice = false;
        state.noticeData = action.payload;
        state.error = null;
      })
      .addCase(fetchNoticeById.rejected, (state, action) => {
        state.loading.notice = false;
        state.error = action.payload;
      })

    // Skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading.skills = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading.skills = false;
        state.skills = action.payload;
        state.error = null;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading.skills = false;
        state.error = action.payload;
      })

    // Job Roles
      .addCase(fetchJobRoles.pending, (state) => {
        state.loading.jobRoles = true;
        state.error = null;
      })
      .addCase(fetchJobRoles.fulfilled, (state, action) => {
        state.loading.jobRoles = false;
        state.jobRoles = action.payload;
        state.error = null;
      })
      .addCase(fetchJobRoles.rejected, (state, action) => {
        state.loading.jobRoles = false;
        state.error = action.payload;
      })

    // Interview Rounds
      .addCase(fetchInterviewRounds.pending, (state) => {
        state.loading.interviewRounds = true;
        state.error = null;
      })
      .addCase(fetchInterviewRounds.fulfilled, (state, action) => {
        state.loading.interviewRounds = false;
        state.interviewRounds = action.payload;
        state.error = null;
      })
      .addCase(fetchInterviewRounds.rejected, (state, action) => {
        state.loading.interviewRounds = false;
        state.error = action.payload;
      })

    // Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading.jobs = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading.jobs = false;
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading.jobs = false;
        state.error = action.payload;
      })

    // Save Job
      .addCase(saveJob.pending, (state) => {
        state.loading.saveJob = true;
        state.success = false;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state) => {
        state.loading.saveJob = false;
        state.success = true;
        state.error = null;
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.loading.saveJob = false;
        state.success = false;
        state.error = action.payload;
      })

    // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading.update = true;
        state.updateError = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.jobs.findIndex(job => job.jobId === action.payload.jobId);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading.update = false;
        state.updateError = action.payload;
      })

    // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job.jobId !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetState } = jobSlice.actions;

// Selectors
export const selectJobState = (state) => ({
  skills: state.jobs.skills || [],
  jobRoles: state.jobs.jobRoles || [],
  interviewRounds: state.jobs.interviewRounds || [],
  noticeData: state.jobs.noticeData,
  loading: state.jobs.loading,
  error: state.jobs.error,
  success: state.jobs.success
});

export default jobSlice.reducer;
