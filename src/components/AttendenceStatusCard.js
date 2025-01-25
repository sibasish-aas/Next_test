import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const AttendanceStatusCard = ({ checkInTime, shift1CheckIn, shift1CheckOut, shift2CheckIn, shift2CheckOut }) => {
  const [currentDate] = useState(new Date());
  const [shift1Hours, setShift1Hours] = useState('00:00 mnt');
  const [shift2Hours, setShift2Hours] = useState('00:00 mnt');
  const [currentWorkingHours, setCurrentWorkingHours] = useState('00:00 mnt');

  useEffect(() => {
    // Calculate Shift 1 Hours
    if (shift1CheckIn && shift1CheckOut) {
      const duration = Math.floor((new Date(shift1CheckOut) - new Date(shift1CheckIn)) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      setShift1Hours(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} mnt`);
    }

    // Calculate Shift 2 Hours
    if (shift2CheckIn && shift2CheckOut) {
      const duration = Math.floor((new Date(shift2CheckOut) - new Date(shift2CheckIn)) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      setShift2Hours(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} mnt`);
    }

    // Calculate Current Working Hours
    if (checkInTime) {
      const now = new Date();
      const duration = Math.floor((now - new Date(checkInTime)) / 1000);
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      setCurrentWorkingHours(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} mnt`);
    }
  }, [checkInTime, shift1CheckIn, shift1CheckOut, shift2CheckIn, shift2CheckOut]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 120, // Increased width for better fit
        height: 120, // Increased height for better fit
        borderRadius: '50%', // Keep it circular
        backgroundColor: '#333', // Dark background
        color: '#fff', // White text
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)', // Scale effect on hover without blur
        },
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.8rem' }}>
        {currentDate.toLocaleDateString()} {/* Display the date */}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.6rem' }}>
        Shift 1: {shift1Hours} {/* Display Shift 1 working hours */}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.6rem' }}>
        Shift 2: {shift2Hours} {/* Display Shift 2 working hours */}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '0.6rem' }}>
        Current: {currentWorkingHours} {/* Display current working hours */}
      </Typography>
    </Box>
  );
};

export default AttendanceStatusCard;