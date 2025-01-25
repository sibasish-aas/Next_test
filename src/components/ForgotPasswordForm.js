'use client';

import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Snackbar, Alert, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      // Save email to local storage (or Redux if you prefer)
      localStorage.setItem('email', email);

      // Replace this URL with your backend API endpoint
      const response = await axios.post('http://localhost:8000/api/hrms/ForgetPassword', {
        email,
      });

      if (response.status === 200) {
        setSnackbarMessage(response.data.message || 'OTP sent successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Redirect to OTP verification page or keep the user here
        setTimeout(() => {
          router.push('/reset-password'); // Replace with your OTP verification page
        }, 2000);
      } else {
        setSnackbarMessage(response.data.message || 'Failed to send OTP. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper
        sx={{
          position: 'relative',
          height: 'auto',
          width: '50vh',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {/* Back Arrow Button */}
        <IconButton
          onClick={() => router.push('/')} // Replace with your home page route
          sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'black',
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <img src="logo.webp" alt="Logo" style={{ marginBottom: '20px', width: '80px', height: 'auto' }} />
        <Typography variant="h5" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
          Forgot your password?
        </Typography>

        {/* Error message */}
        <Box
          sx={{
            color: '#F34040',
            backgroundColor: '#FBDBDB',
            borderRadius: '10px',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            height: error ? 'auto' : '0px',
            minHeight: '40px',
            visibility: error ? 'visible' : 'hidden',
            opacity: error ? 1 : 0,
            transition: 'visibility 0s, opacity 0.3s ease',
            marginBottom: '10px',
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        </Box>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              marginBottom: '15px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: 'black',
              color: 'white',
              padding: '8px 10px',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'black',
              },
            }}
          >
            Submit
          </Button>
        </form>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForgotPasswordPage;