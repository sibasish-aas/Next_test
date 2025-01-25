



'use client'; 
import React from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import InterviewResult from '../interview/InterviewResult';

const ShortlistedView = ({ application }) => {

  // If application is null or undefined, return early
  if (!application) {
    return <Typography variant="body2" color="error">No application data available.</Typography>;
  }

  const labels = {
    applicantId: 'Application ID',
    fullName: 'Full Name',
    dateOfBirth: 'Date of Birth',
    address: 'Address',
    gender: 'Gender',
    email: 'Email',
    contact: 'Contact',
    role: 'Role',
    yearOfExperience: 'Experience',
    highestQualification: 'Qualification',
    skills: 'Skills',
    appliedDate: 'Applied Date',
    resume: 'Resume',  // Added Resume here
  };

  // Function to format Date of Birth as dd-mm-yyyy
  const formatDateOfBirth = (dateString) => {
    const date = new Date(dateString);
    if (date instanceof Date && !isNaN(date)) {
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return 'N/A'; // In case the date is not valid
  };

  // Function to format Applied Date as dd-MMMM-yyyy
  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString);
    if (date instanceof Date && !isNaN(date)) {
      const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
      const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return 'N/A'; // In case the date is not valid
  };

  // Function to format Year of Experience and append "yr"
  const formatYearOfExperience = (year) => {
    return year ? `${year} yr` : 'N/A';
  };

  // Function to handle the resume download (currently just logs to console)
  const handleDownloadResume =async () => {
    console.log('Resume downloaded');
    // Implement the actual resume download functionality here
    
  };

  
  // Splitting the labels into two halves, if odd, left column gets the extra label
  const labelKeys = Object.keys(labels);
  const mid = Math.ceil(labelKeys.length / 2); // Ensure the left column gets the extra label if odd
  const labelKeysLeft = labelKeys.slice(0, mid); // Left column gets the first half (or extra label)
  const labelKeysRight = labelKeys.slice(mid); // Right column gets the second half

  return (
    <Box sx={{ padding: 2, width: '100%' }}>
      <Grid container spacing={3} justifyContent="space-between"> {/* Ensures equal spacing between columns */}
        
        {/* Left column */}
        <Grid item xs={5}> {/* Take 5/12 of the grid width */}
          {labelKeysLeft.map((key) => (
            <Grid container item key={key} spacing={1}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" fontWeight="bold">{labels[key]}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {key === 'dateOfBirth' && application[key]
                    ? formatDateOfBirth(application[key]) // Format dateOfBirth in dd-mm-yyyy
                    : key === 'appliedDate' && application[key]
                    ? formatAppliedDate(application[key]) // Format appliedDate in dd-MMMM-yyyy
                    : key === 'yearOfExperience' && application[key]
                    ? formatYearOfExperience(application[key]) // Add 'yr' to yearOfExperience
                    : application[key] ? application[key] : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>

        {/* Right column */}
        <Grid item xs={5}> {/* Take 5/12 of the grid width */}
          {labelKeysRight.map((key) => (
            <Grid container item key={key} spacing={1}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" fontWeight="bold">{labels[key]}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {key === 'dateOfBirth' && application[key]
                    ? formatDateOfBirth(application[key]) // Format dateOfBirth in dd-mm-yyyy
                    : key === 'appliedDate' && application[key]
                    ? formatAppliedDate(application[key]) // Format appliedDate in dd-MMMM-yyyy
                    : key === 'yearOfExperience' && application[key]
                    ? formatYearOfExperience(application[key]) // Add 'yr' to yearOfExperience
                    : key === 'resume' && application[key] // Check if the key is 'resume'
                    ? (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        startIcon={<DownloadIcon />} 
                        onClick={handleDownloadResume}
                      >
                         Resume
                      </Button>
                    )
                    : application[key] ? application[key] : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid container spacing={3} justifyContent="center"> {/* Centered content for InterviewResult */}
        <Grid item xs={12}>
          <InterviewResult Application={application} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShortlistedView;
