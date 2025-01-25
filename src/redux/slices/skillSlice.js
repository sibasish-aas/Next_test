// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { API_CONFIG } from '../../api/apiConfig';  // Import the API_CONFIG

// // Function to get the token (from localStorage or wherever it's stored)
// const getAuthToken = () => localStorage.getItem('authToken'); // Assuming it's stored in localStorage

// // Set the Authorization header with the token
// const setAuthHeaders = () => {
//   const token = getAuthToken();
//   if (token) {
//     return { Authorization: `Bearer ${token}` }; // Include token in Authorization header
//   }
//   return {};
// };

// // Fetch all skills
// export const fetchSkills = createAsyncThunk('skills/fetchSkills', async () => {
//   const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getskilllist`, {
//     headers: setAuthHeaders(),  // Include token in headers
//   });
//   return response.data.skills; // Assuming the API returns the list in 'skills'
// });

// // Add a new skill
// export const addSkill = createAsyncThunk('skills/addSkill', async (skill) => {
//   const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveskill`, { skill }, {
//     headers: setAuthHeaders(),  // Include token in headers
//   });
//   return response.data.skill; // Returning the added skill
// });

// // Update a skill
// export const updateSkill = createAsyncThunk('skills/updateSkill', async (skill) => {
//   const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateskill/${skill.skillId}`, { skill: skill.skill }, {
//     headers: setAuthHeaders(),  // Include token in headers
//   });
//   return response.data.skill; // Returning the updated skill
// });

// // Delete a skill
// export const deleteSkill = createAsyncThunk('skills/deleteSkill', async (skillId) => {
//   await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteskill/${skillId}`, {
//     headers: setAuthHeaders(),  // Include token in headers
//   });
//   return skillId; // Returning the skillId of the deleted skill
// });

// const skillSlice = createSlice({
//   name: 'skills',
//   initialState: { skills: [], error: null, success: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//     .addCase(fetchSkills.fulfilled, (state, action) => {
//         state.skills = action.payload;
//         state.error = null; // Clear error when successful
//         state.success = 'Skills fetched successfully!';  // Success message
//       })
//       .addCase(fetchSkills.rejected, (state, action) => {
//         state.error = action.error?.message || 'Failed to fetch skills';  // Capture error message
//         state.success = null;  // Clear success message if there's an error
//       })
//       .addCase(addSkill.fulfilled, (state, action) => {
//         state.skills.push(action.payload);
//         state.error = null;  // Clear error when successful
//         state.success = 'Skill added successfully!';  // Success message
//       })
//       .addCase(addSkill.rejected, (state, action) => {
//         const errorMessage = action.response?.error?.data?.message  || 'Skill already exists';
//         state.error = errorMessage;  // Capture error message from the response
//         state.success = null;  // Clear success message if there's an error
//       })
//       .addCase(updateSkill.fulfilled, (state, action) => {
//         const index = state.skills.findIndex((s) => s.skillId === action.payload.skillId);
//         if (index !== -1) state.skills[index] = action.payload;
//         state.error = null;  // Clear error when successful
//         state.success = 'Skill updated successfully!';  // Success message
//       })
//       .addCase(updateSkill.rejected, (state, action) => {
//         const errorMessage = action.error?.response?.data?.message || action.error.message || 'Failed to update skill';
//         state.error = errorMessage;
//         state.success = null;  // Clear success message if there's an error
//       })
//       .addCase(deleteSkill.fulfilled, (state, action) => {
//         state.skills = state.skills.filter((s) => s.skillId !== action.payload);
//         state.error = null;  // Clear error when successful
//         state.success = 'Skill deleted successfully!';  // Success message
//       })
//       .addCase(deleteSkill.rejected, (state, action) => {
//         const errorMessage = action.error?.response?.data?.message || action.error.message || 'Failed to delete skill';
//         state.error = errorMessage;
//         state.success = null;  // Clear success message if there's an error
//       });
//     },
// });

// export default skillSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG } from '../../api/apiConfig';  // Import the API_CONFIG

// Function to get the token (from localStorage or wherever it's stored)
const getAuthToken = () => localStorage.getItem('authToken'); // Assuming it's stored in localStorage

// Set the Authorization header with the token
const setAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` }; // Include token in Authorization header
  }
  return {};
};

// Fetch all skills
export const fetchSkills = createAsyncThunk('skills/fetchSkills', async () => {
  const response = await axios.get(`${API_CONFIG.getBaseUrl()}/getskilllist`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data.skills; // Assuming the API returns the list in 'skills'
});

// Add a new skill
export const addSkill = createAsyncThunk('skills/addSkill', async (skill) => {
  const response = await axios.post(`${API_CONFIG.getBaseUrl()}/saveskill`, { skill }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data.skill; // Returning the added skill
});

// Update a skill
export const updateSkill = createAsyncThunk('skills/updateSkill', async (skill) => {
  const response = await axios.put(`${API_CONFIG.getBaseUrl()}/updateskill/${skill.skillId}`, { skill: skill.skill }, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return response.data.skill; // Returning the updated skill
});

// Delete a skill
export const deleteSkill = createAsyncThunk('skills/deleteSkill', async (skillId) => {
  await axios.delete(`${API_CONFIG.getBaseUrl()}/deleteskill/${skillId}`, {
    headers: setAuthHeaders(),  // Include token in headers
  });
  return skillId; // Returning the skillId of the deleted skill
});

const skillSlice = createSlice({
  name: 'skills',
  initialState: { skills: [], error: null, success: null },
  reducers: {
    resetMessages: (state) => {
      state.success = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
        state.error = null; // Clear error when successful
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to fetch skills';  // Capture error message
        state.success = null;  // Clear success message if there's an error
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
        state.error = null;  // Clear error when successful
        state.success = 'Skill added successfully!';  // Success message
      })
      .addCase(addSkill.rejected, (state, action) => {
        const errorMessage = action.response?.error?.data?.message  || 'Skill already exists';
        state.error = errorMessage;  // Capture error message from the response
        state.success = null;  // Clear success message if there's an error
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        const index = state.skills.findIndex((s) => s.skillId === action.payload.skillId);
        if (index !== -1) state.skills[index] = action.payload;
        state.error = null;  // Clear error when successful
        state.success = 'Skill updated successfully!';  // Success message
      })
      .addCase(updateSkill.rejected, (state, action) => {
        const errorMessage = action.error?.response?.data?.message || action.error.message || 'Failed to update skill';
        state.error = errorMessage;
        state.success = null;  // Clear success message if there's an error
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter((s) => s.skillId !== action.payload);
        state.error = null;  // Clear error when successful
        state.success = 'Skill deleted successfully!';  // Success message
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        const errorMessage = action.error?.response?.data?.message || action.error.message || 'Failed to delete skill';
        state.error = errorMessage;
        state.success = null;  // Clear success message if there's an error
      });
    },
});

export default skillSlice.reducer;
