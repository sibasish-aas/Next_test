'use client';

import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, Paper, Snackbar, Alert, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import axios from 'axios'; // Import axios

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Retrieve email from localStorage
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Redirect to forgot password page if no email is found
      router.push('/forgot-password');
    }
  }, []);

  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6 || isNaN(otp)) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(''); // Clear any previous errors

    try {
      // Replace this URL with your backend API endpoint
      const response = await axios.post('http://192.168.0.136:8080/api/hrms/resetPassword', {
        otp,
        newPassword,
        email,
      });

      if (response.status === 200) {
        setSnackbarMessage(response.data.message || 'Password reset successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);

        // Redirect to login page after successful password reset
        setTimeout(() => {
          router.push('/'); // Replace with your login page route
        }, 2000);
      } else {
        setSnackbarMessage(response.data.message || 'OTP verification failed. Redirecting...');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);

        // Redirect back to forgot password page
        setTimeout(() => {
          router.push('/forgot-password');
        }, 2000);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
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
          onClick={() => router.push('/forgot-password')}
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
          Reset your password
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
          <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
            {error}
          </Typography>
        </Box>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Enter OTP"
            variant="outlined"
            fullWidth
            margin="normal"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
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
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Reset Password
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

export default ResetPasswordPage;