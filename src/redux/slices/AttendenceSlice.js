import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import attendenceApi from '../../api/attendenceApi';

// Only AllAttendence thunk
export const fetchAllAttendances = createAsyncThunk(
  'attendance/fetchAllAttendances',
  async () => {
    try {
      const response = await attendenceApi.fetchAllAttendances();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  // Only AllAttendence states
  allAttendances: [],
  filteredAttendances: [],
  loading: false,
  error: null,
  checkInTime: null,
  shift1CheckIn: null,
  shift1CheckOut: null,
  shift2CheckIn: null,
  shift2CheckOut: null,
  isShift1CheckedIn: false, // New state variable to track Shift 1 check-in status
  isShift2CheckedIn: false,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
 
  reducers: {
    setCheckInTime: (state, action) => {
      state.checkInTime = action.payload; // Set the check-in time
    },
    setShift1CheckIn: (state, action) => {
      state.shift1CheckIn = action.payload; // Set Shift 1 Check-in time
      state.isShift1CheckedIn = true; // Mark as checked in
    },
    setShift1CheckOut: (state, action) => {
      state.shift1CheckOut = action.payload; // Set Shift 1 Check-out time
      state.isShift1CheckedIn = false; // Reset checked in status
    },
    setShift2CheckIn: (state, action) => {
      state.shift2CheckIn = action.payload; // Set Shift 2 Check-in time
      state.isShift2CheckedIn = true; // Mark as checked in
    },
    setShift2CheckOut: (state, action) => {
      state.shift2CheckOut = action.payload; // Set Shift 2 Check-out time
      state.isShift2CheckedIn = false; // Reset checked in status
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAttendances.pending, (state) => {
        state.loading = true; // Set loading state
      })
      .addCase(fetchAllAttendances.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.allAttendances = action.payload; // Store fetched attendances
        state.filteredAttendances = action.payload; // Store filtered attendances
      })
      .addCase(fetchAllAttendances.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.error.message; // Set error message
      });
  },
});


// Export actions
export const {
  setCheckInTime,
  setShift1CheckIn,
  setShift1CheckOut,
  setShift2CheckIn,
  setShift2CheckOut,
} = attendanceSlice.actions;

// Export reducer
export default attendanceSlice.reducer;