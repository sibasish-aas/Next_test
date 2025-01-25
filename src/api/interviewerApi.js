import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.134:8082/api/hrms', // Base URL for the API
  headers: {
    'Content-Type': 'application/json', // Default header
  },
});

// Helper function to get the token from localStorage or another source
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust based on where you store the token
};

// Submit feedback for an applicant
export const fetchInterviewsApi = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  try {
    const response = await axiosInstance.get('/getinterviews', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching:', error);
    throw error.response?.data || error.message || 'Unknown error'; // Handle errors better
  }
};

// Submit feedback for an array of applicants (feedbackArray)
export const submitApplicantFeedbackApi = async (feedbackData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authorization token is missing');
  }

  try {
    const response = await axiosInstance.put('/submitfeedback', feedbackData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the response contains the updated feedback data
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error.response?.data || error.message || 'Unknown error'; // Handle errors better
  }
};
