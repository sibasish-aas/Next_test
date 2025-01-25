import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchLeaveApplicationsApi,
  fetchEmployeeLeaveApplicationsApi,
  updateLeaveStatusApi,
  submitLeaveRequestApi,
  fetchEmployeeByEmailApi,
  downloadAttachmentApi,
  getavailableleavesApi
} from '../../api/leaveApi';

// Initial state
const initialState = {
  leaveApplications: [],
  status: 'idle',
  error: null,
  employeeLeaveApplications: [],
  employeeStatus: 'idle',
  EmployeeData: [], // Add EmployeeData to initial state
  EmployeeAvialableLeave:[]
};


// Async thunks

// Fetch all leave applications
export const fetchLeaveApplications = createAsyncThunk(
  'leave/fetchLeaveApplications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchLeaveApplicationsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Fetch leave applications by employee ID
export const fetchEmployeeLeaveApplications = createAsyncThunk(
  'leave/fetchEmployeeLeaveApplications',
  async (employeeId, { rejectWithValue }) => {
    try {
      const data = await fetchEmployeeLeaveApplicationsApi(employeeId);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Update leave status
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ EmployeeId, Leave_Id, Status }, { rejectWithValue }) => {
    try {
      const data = await updateLeaveStatusApi({ EmployeeId, Leave_Id, Status });
      return data;
      
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Submit new leave request
export const submitLeaveRequest = createAsyncThunk(
  'leave/submitLeaveRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await submitLeaveRequestApi(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Fetch employee by email
export const fetchEmployeeByEmail = createAsyncThunk(
  'leave/fetchEmployeeByEmail',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchEmployeeByEmailApi();
      return data;
      
      
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Download attachment
export const downloadAttachment = createAsyncThunk(
  'leave/downloadAttachment',
  async (leaveRequestId, { rejectWithValue }) => {
    try {
      const response = await downloadAttachmentApi(leaveRequestId);
      return response;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);
// Download attachment
export const getavailableleaves = createAsyncThunk(
  'leave/getavailableleaves',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await getavailableleavesApi(employeeId);
      //console.log(response)
      return response;
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

// Slice
const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {},
  extraReducers: (builder) => {


    // Fetch all leave applications
    builder.addCase(fetchLeaveApplications.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchLeaveApplications.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.leaveApplications = action.payload;
    });
    builder.addCase(fetchLeaveApplications.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });

    // Fetch employee's leave applications
    builder.addCase(fetchEmployeeLeaveApplications.pending, (state) => {
      state.employeeStatus = 'loading';
      state.error = null;
    });
    builder.addCase(fetchEmployeeLeaveApplications.fulfilled, (state, action) => {
      state.employeeStatus = 'succeeded';
      state.employeeLeaveApplications = action.payload;
    });
    builder.addCase(fetchEmployeeLeaveApplications.rejected, (state, action) => {
      state.employeeStatus = 'failed';
      state.error = action.payload;
    });

    // Update leave status
    builder.addCase(updateLeaveStatus.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateLeaveStatus.fulfilled, (state, action) => {
      state.leaveApplications = state.leaveApplications.map(leaveRequest =>
        leaveRequest.Leave_Id === action.payload.Leave_Id
          ? { ...leaveRequest, Status: action.payload.Status }
          : leaveRequest
      );
    });
    builder.addCase(updateLeaveStatus.rejected, (state, action) => {
      state.error = action.payload;
    });

    // Submit new leave request
    builder.addCase(submitLeaveRequest.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(submitLeaveRequest.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.leaveApplications = [...state.leaveApplications, action.payload];
      //alert('Leave request submitted successfully!');
    });
    builder.addCase(submitLeaveRequest.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
      //alert('An error occurred while submitting the leave request.');
    });

    // Fetch employee by email
    builder.addCase(fetchEmployeeByEmail.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchEmployeeByEmail.fulfilled, (state, action) => {
      state.EmployeeData = action.payload;
      //console.log('Employee data:', action.payload);
    });
    builder.addCase(fetchEmployeeByEmail.rejected, (state, action) => {
      state.error = action.payload;
      
    });

    // Download attachment
    builder.addCase(downloadAttachment.fulfilled, (state, action) => {
      const url = window.URL.createObjectURL(new Blob([action.payload.data]));
      const link = document.createElement('a');
      const contentType = action.payload.headers['content-type'];
      const extension = contentType.split('/')[1];
      link.href = url;
      link.setAttribute('download', `attachment_${action.meta.arg}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
    builder.addCase(downloadAttachment.rejected, (state, action) => {
      state.error = action.payload;
    });



    // In the extraReducers of your slice:
    builder.addCase(getavailableleaves.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(getavailableleaves.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.EmployeeAvialableLeave = action.payload; // Update available leave state
    });
    builder.addCase(getavailableleaves.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    });
  },
});

// Export reducer
export default leaveSlice.reducer;
