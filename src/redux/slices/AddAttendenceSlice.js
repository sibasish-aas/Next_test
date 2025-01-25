import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendenceApi from '../../api/attendenceApi';

// Async thunk for marking attendance
export const markAttendance = createAsyncThunk(
  'addAttendence/markAttendance',
  async ({ action, email }, { rejectWithValue }) => {
    try {
      let response;
      switch (action) {
        case 'shift1CheckIn':
          response = await attendenceApi.shift1CheckIn(email);
          break;
        case 'shift1CheckOut':
          response = await attendenceApi.shift1CheckOut(email);
          break;
        case 'shift2CheckIn':
          response = await attendenceApi.shift2CheckIn(email);
          break;
        case 'shift2CheckOut':
          response = await attendenceApi.shift2CheckOut(email);
          break;
        default:
          throw new Error('Invalid action');
      }
      
      // Fetch updated attendance data
      const updatedData = await attendenceApi.fetchEmployeeData(email);
      return {
        action,
        attendanceHistory: updatedData.attendanceHistory
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentShiftState: 'shift1CheckIn',
  attendanceHistory: [],
  loading: false,
  error: null
};

const addAttendenceSlice = createSlice({
  name: 'addAttendence',
  initialState,
  reducers: {
    setCurrentShiftState: (state, action) => {
      state.currentShiftState = action.payload;
    },
    setAttendanceHistory: (state, action) => {
      state.attendanceHistory = action.payload;
    },
    resetState: (state) => {
      state.currentShiftState = 'shift1CheckIn';
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(markAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.attendanceHistory = action.payload.attendanceHistory;
        
        // Update shift state based on action
        switch (action.payload.action) {
          case 'shift1CheckIn':
            state.currentShiftState = 'shift1CheckOut';
            break;
          case 'shift1CheckOut':
            state.currentShiftState = 'shift2CheckIn';
            break;
          case 'shift2CheckIn':
            state.currentShiftState = 'shift2CheckOut';
            break;
          case 'shift2CheckOut':
            state.currentShiftState = 'shift1CheckIn';
            break;
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setCurrentShiftState, setAttendanceHistory, resetState } = addAttendenceSlice.actions;
export default addAttendenceSlice.reducer;
