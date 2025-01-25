// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { noticeApi } from '../../api/noticeApi';

// // Create the async thunk
// export const fetchJobNotices = createAsyncThunk(
//   'jobNotices/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get('http://localhost:8000/api/hrms/getjoblist', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Update the updateNoticeStatus thunk
// export const updateNoticeStatus = createAsyncThunk(
//   'jobNotices/updateStatus',
//   async ({ jobNoticeId, feedback, status }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await noticeApi.updateNoticeStatus({
//         jobNoticeId,
//         feedback,
//         status
//       });

//       if (!response.success) {
//         return rejectWithValue(response.message || 'Failed to update status');
//       }

//       // Immediately fetch fresh data after successful update
//       await dispatch(fetchJobNotices());
//       return {
//         success: true,
//         data: response.data,
//         message: response.message
//       };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Failed to update status');
//     }
//   }
// );

// // Add updateJobNotice thunk for consistency
// export const updateJobNotice = createAsyncThunk(
//   'jobNotices/updateJobNotice',
//   async (noticeData, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await noticeApi.updateJobNotice(noticeData);
//       if (!response.success) {
//         return rejectWithValue(response.message || 'Update failed');
//       }
      
//       // Immediately fetch fresh data after successful update
//       await dispatch(fetchJobNotices());
//       return {
//         success: true,
//         data: response.data,
//         message: response.message
//       };
//     } catch (error) {
//       return rejectWithValue(error.message || 'Update failed');
//     }
//   }
// );

// const jobNoticeSlice = createSlice({
//   name: 'jobNotices',
//   initialState: {
//     items: [],
//     status: 'idle',
//     error: null,
//     selectedNotice: null,
//     updateSuccess: false
//   },
//   reducers: {
//     setSelectedNotice: (state, action) => {
//       state.selectedNotice = action.payload;
//     },
//     clearSelectedNotice: (state) => {
//       state.selectedNotice = null;
//     },
//     resetUpdateSuccess: (state) => {
//       state.updateSuccess = false;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchJobNotices.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchJobNotices.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchJobNotices.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(updateNoticeStatus.pending, (state) => {
//         state.status = 'loading';
//         state.updateSuccess = false;
//       })
//       .addCase(updateNoticeStatus.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.updateSuccess = true;
//         state.error = null;
        
//         // Update the specific notice in the items array
//         if (action.payload.data) {
//           const updatedNotice = action.payload.data;
//           state.items = state.items.map(notice => 
//             notice.jobNoticeId === updatedNotice.jobNoticeId ? updatedNotice : notice
//           );
          
//           if (state.selectedNotice?.jobNoticeId === updatedNotice.jobNoticeId) {
//             state.selectedNotice = updatedNotice;
//           }
//         }
//       })
//       .addCase(updateNoticeStatus.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         state.updateSuccess = false;
//       })
//       .addCase(updateJobNotice.pending, (state) => {
//         state.status = 'loading';
//         state.updateSuccess = false;
//       })
//       .addCase(updateJobNotice.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.updateSuccess = true;
//         state.error = null;
        
//         // Update the specific notice in the items array
//         if (action.payload.data) {
//           const updatedNotice = action.payload.data;
//           state.items = state.items.map(notice => 
//             notice.jobNoticeId === updatedNotice.jobNoticeId ? updatedNotice : notice
//           );
//         }
//       })
//       .addCase(updateJobNotice.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//         state.updateSuccess = false;
//       });
//   }
// });

// export const { setSelectedNotice, clearSelectedNotice, resetUpdateSuccess } = jobNoticeSlice.actions;
// export default jobNoticeSlice.reducer;
