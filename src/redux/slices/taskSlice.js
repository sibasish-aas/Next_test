

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../api/apiConfig';

const BASE_URL = API_CONFIG.getBaseUrl();


// Define the base URL of your backend
// const BASE_URL = 'http://localhost:8080/api/hrms';  // Adjust this to your backend URL

// Function to get the token (from localStorage or other sources)
const getAuthToken = () => {
  return localStorage.getItem('authToken');  // Adjust this if you're storing the token elsewhere
};

// Async action to fetch all tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const token = getAuthToken();  // Retrieve token from localStorage
  try {
    const response = await axios.get(`${BASE_URL}/getAlltasks`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data; // Expecting the list of tasks from the server
  } catch (error) {
    // Checking if the error is a CORS error (usually an issue with the response headers)
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The request was blocked by the server due to cross-origin restrictions.');
    }
    throw error;  // Re-throw the error if it's not a CORS error
  }
});

// Async action to fetch tasks by employee email
export const fetchTasksByEmail = createAsyncThunk('tasks/fetchTasksByEmail', async () => {
  const email = localStorage.getItem('email');  // Ensure you retrieve email here
  const token = getAuthToken();  // Retrieve token from localStorage

  if (!email) {
    throw new Error('Email is not available');
  }

  try {
    const response = await axios.post(`${BASE_URL}/findTasksByEmail`, { email }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });

    //console.log("Fetched tasks:", response.data);
    return response.data;  // Return the fetched data from the response
  } catch (error) {
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The request was blocked by the server due to cross-origin restrictions.');
    }
    throw error;  // Re-throw any other errors
  }
});

// Async action to add a new task
export const addTask = createAsyncThunk('tasks/addTask', async (taskData, { dispatch }) => {
  const token = getAuthToken();  // Retrieve token from localStorage
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, taskData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    // Dispatch the task directly to the store after adding it
    dispatch(taskSlice.actions.addTask(response.data)); // Add the new task to the state
    return response.data;  // Return the new task data
  } catch (error) {
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The request was blocked by the server due to cross-origin restrictions.');
    }
    throw error;  // Re-throw the error if it's not a CORS error
  }
});

// Async action to get tasks by StartDate
export const fetchTasksByStartDate = createAsyncThunk('tasks/fetchTasksByStartDate', async (startDate) => {
  const token = getAuthToken();  // Retrieve token from localStorage
  try {
    const response = await axios.get(`${BASE_URL}/findTaskByStartDate/${startDate}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data; // Expecting tasks for the given StartDate
  } catch (error) {
    if (error.message.includes('CORS')) {
      throw new Error('CORS error: The request was blocked by the server due to cross-origin restrictions.');
    }
    throw error;  // Re-throw the error if it's not a CORS error
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',  // Track loading, success, or failure states
    error: null,     // Store any errors
  },
  reducers: {
    // Add task to the store
    addTask: (state, action) => {
      state.tasks.push(action.payload); // Adds the new task to the state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.tasks || []; // Store the list of tasks
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        // Check for CORS errors and show a custom message
        if (action.error.message.includes('CORS')) {
          state.error = 'CORS error occurred: The request was blocked by the server.';
        } else {
          state.error = action.error.message; // Generic error message
        }
      })
      .addCase(fetchTasksByEmail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload.tasks || []; // Store the tasks by email
      })
      .addCase(fetchTasksByEmail.rejected, (state, action) => {
        state.status = 'failed';
        // Handle error gracefully
        if (action.error.message.includes('CORS')) {
          state.error = 'CORS error occurred: The request was blocked by the server.';
        } else {
          state.error = action.error.message;
        }
      })
      .addCase(fetchTasksByStartDate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasksByStartDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload; // Store tasks by start date
      })
      .addCase(fetchTasksByStartDate.rejected, (state, action) => {
        state.status = 'failed';
        // Handle error gracefully
        if (action.error.message.includes('CORS')) {
          state.error = 'CORS error occurred: The request was blocked by the server.';
        } else {
          state.error = action.error.message;
        }
      });
  },
});

// Exporting actions and reducer
export default taskSlice.reducer;
 