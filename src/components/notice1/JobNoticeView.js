import React from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';

const JobNoticeView = ({ notice }) => {
  const handleCreateJobClick = () => {
    alert(`Navigate to create job page or modal. Job ID: ${notice.jobNoticeId}`);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        {/* Column 1: Job Details */}
        <Grid item xs={12} sm={6}>
          {/* Conditionally render the Job ID if the status is 'approved' */}
         
            <Typography variant="body1" gutterBottom>
              <strong>Job Notice ID:</strong> {notice.jobNoticeId}
            </Typography>
          

          <Typography variant="body1" gutterBottom>
            <strong>Role:</strong> {notice.jobTitle}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Category:</strong> {notice.jobCategory}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Number of Positions:</strong> {notice.noOfPositions}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong> {notice.status}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Publish Date:</strong> {new Date(notice.publishDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Expiry Date:</strong> {new Date(notice.expiryDate).toLocaleDateString()}
          </Typography>
        </Grid>

        {/* Column 2: Description */}
        <Grid item xs={12} sm={6}>
          {/* Make the description stronger */}
          {/* Description in row-wise format */}
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <Typography variant="body1"><strong>Description:</strong></Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {notice.description}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Feedback Section */}
      <Grid container spacing={1} sx={{ marginTop: 2 }}>
        <Grid item xs={12}>
          <Typography variant="body1"><strong>Feedback:</strong></Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {notice.feedback || 'No feedback available.'}
          </Typography>
        </Grid>
      </Grid>

      {/* Create a Job Button: Only clickable if status is 'approved' */}
      {notice.status === 'approved' && (
        <Grid item xs={12} sm={6} sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: '100%',
              maxWidth: '150px', // Button size reduced
              padding: '8px', // Slight padding to make it look a little smaller
            }}
            onClick={handleCreateJobClick}
          >
            Create a Job
          </Button>
        </Grid>
      )}
    </Box>
  );
};

export default JobNoticeView;
