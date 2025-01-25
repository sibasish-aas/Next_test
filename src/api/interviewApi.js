import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.134:8082/api/hrms', // Base URL for the API
  headers: {
    'Content-Type': 'application/json', // Default header
  },
});
// Helper function to get the token from localStorage or another source
const token = () => {
  return localStorage.getItem('token');  // Adjust based on where you store the token
};


// schedule intervieScheduleApi
export const scheduleInterviewApi = async (formData) => {
  try {
    const response = await axiosInstance.post('/saveinterviewschedule', formData,{
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    });
    console.log("schedule interview data is : ",res.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// re-schedule intervieScheduleApi
export const rescheduleInterviewApi = async (applicantId, formData) => {
  try {
    const response = await axiosInstance.put(`/updateInterviewschedule/${applicantId}`, formData,{
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    });
    console.log("reschedule  data is : ",response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};


//  interview rounds result data
export const fetchInterviewRoundDataApi = async (applicantDetails) => {
  try {
    const response = await axiosInstance.post('/save', applicantDetails,{
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    });
    console.log("Interview round data for a applicant: ",response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};




