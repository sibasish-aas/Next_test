// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Set the token in local storage
// // const setToken = (token) => {
// //   if (typeof window !== 'undefined') {
// //     localStorage.setItem('token', token);
// //   }
// // };

// // Example of setting the token
// // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OGIzMGEzODVlY2QyNTAxZDllYjc1OSIsInJvbGUiOiJTdXBlciBBZG1pbiIsImlhdCI6MTczNzM2NTQ2OCwiZXhwIjoxNzM3NDUxODY4fQ.8Ql0QOFTi7FGAF1fIgTw0nOqnJhLLpgat8MlLsTgpGY';
// // setToken(token);

// // Function to get the token from local storage
// const getAuthToken = () => {
// //   if (typeof window !== 'undefined') {
//     return localStorage.getItem('authToken');
    
   
    
// //   }
// //   return null;
// };



// // Function to set the Authorization headers
// const setAuthHeaders = () => {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // API URL
// const apiUrl = 'http://localhost:8000/api/hrms/getfinalselectedcandidatelist'; 

// // Async thunk to fetch candidates
// export const fetchCandidates = createAsyncThunk(
//   'candidates/fetchCandidates',
//   async (_, { rejectWithValue }) => {
//     try {
//       const headers = setAuthHeaders();
      
//       // Debugging: Log the headers and token
//       console.log('Headers:', headers);
      
//       const response = await axios.get(apiUrl, { headers });

//       // Debugging: Log the response to check structure
//       console.log('API Response:', response);

//       // Ensure that the structure is correct
//       if (response.data && response.data.finalists) {
//         return response.data.finalists; 
//       } else {
//         throw new Error('No finalists found');
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Slice for handling candidates
// const selectcandidateSlice = createSlice({
//   name: 'candidates',
//   initialState: {
//     candidates: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCandidates.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCandidates.fulfilled, (state, action) => {
//         state.loading = false;
//         state.candidates = action.payload;
//       })
//       .addCase(fetchCandidates.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch candidates";
//       });
//   },
// });

// // Export the reducer
// export default selectcandidateSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // Function to get the token from local storage
// const getAuthToken = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('token');
//   }
//   return null;
// };

// // Function to set the Authorization headers
// const setAuthHeaders = () => {
//   const token = getAuthToken();
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // API URL
// const apiUrl = 'http://localhost:8000/api/hrms/getfinalselectedcandidatelist'; 

// // Async thunk to fetch candidates
// export const fetchCandidates = createAsyncThunk(
//   'candidates/fetchCandidates',
//   async (_, { rejectWithValue }) => {
//     try {
//       const headers = setAuthHeaders();
      
//       // Debugging: Log the headers and token
//       console.log('Headers:', headers);
      
//       const response = await axios.get(apiUrl, { headers });

//       // Debugging: Log the response to check structure
//       console.log('API Response:', response);

//       // Ensure that the structure is correct
//       if (response.data && response.data.finalists) {
//         return response.data.finalists; 
//       } else {
//         throw new Error('No finalists found');
//       }
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // Slice for handling candidates
// const selectcandidateSlice = createSlice({
//   name: 'candidates',
//   initialState: {
//     candidates: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCandidates.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCandidates.fulfilled, (state, action) => {
//         state.loading = false;
//         state.candidates = action.payload;
//       })
//       .addCase(fetchCandidates.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch candidates";
//       });
//   },
// });

// // Export the reducer
// export default selectcandidateSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');  // Ensure consistency with taskSlice
};

// API URL
const apiUrl = 'http://localhost:8000/api/hrms/getfinalselectedcandidatelist'; 

// Async thunk to fetch candidates
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, { rejectWithValue }) => {
    const token = getAuthToken();  // Retrieve token from localStorage
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      // Ensure that the structure is correct
      if (response.data && response.data.finalists) {
        return response.data.finalists; 
      } else {
        throw new Error('No finalists found');
      }
    } catch (error) {
      if (error.message.includes('CORS')) {
        return rejectWithValue('CORS error: The request was blocked by the server due to cross-origin restrictions.');
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for handling candidates
const selectcandidateSlice = createSlice({
  name: 'candidates',
  initialState: {
    candidates: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch candidates';
      });
  },
});

// Export the reducer
export default selectcandidateSlice.reducer;
