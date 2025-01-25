import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    jobTitle: '',
    description: '',
    publishDate: '',
    expiryDate: '',
    jobCategory: '',
    noOfPositions: '',
    feedback: '', 
    // status: '',
  },
  errors: {},
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    resetFormData: (state) => {
      state.formData = initialState.formData; 
      state.errors = {}; 
    },
  },
});

export const { setFormData, setErrors, resetFormData } = formSlice.actions;

export default formSlice.reducer;
