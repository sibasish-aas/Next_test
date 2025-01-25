import React, { useState, useEffect } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, Box, Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleInterview, rescheduleInterview, resetInterviewData } from '../../redux/slices/InterviewSlice/InterviewSlice'; // Adjust path accordingly

const ScheduleForm = ({ application, roundName, interviewers, existingInterviewData, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  
  const [interviewDate, setInterviewDate] = useState(existingInterviewData?.interviewDate || '');
  const [interviewTime, setInterviewTime] = useState(existingInterviewData?.interviewTime || '');
  const [interviewMode, setInterviewMode] = useState(existingInterviewData?.interviewMode || ''); 
  const [selectedInterviewer, setSelectedInterviewer] = useState(existingInterviewData?.interviewerName || '');
  const [generateEmailInterviewer, setGenerateEmailInterviewer] = useState(false);
  const [generateEmailApplicant, setGenerateEmailApplicant] = useState(false);

  // Extracting interview state and status
  const { status, error, interviewData } = useSelector((state) => state.interview);

  // Validate form fields
  const validateForm = () => {
    return interviewDate && interviewTime && interviewMode && selectedInterviewer;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Prepare the formData to send to the API
    const formData = {
      applicantId: application.applicantId,
      fullName: application.fullName,
      role: application.role,
      candidateEmail: application.candidateEmail,
      interviewerEmail: "swagatsony1430@gmail.com", // Adjust email logic if necessary
      interviewDate,
      interviewTime,
      interviewMode,
      selectedRound: roundName,
      interviewerName: selectedInterviewer,
      generateEmailInterviewer,
      generateEmailCandidate: generateEmailApplicant,
    };

    const isReschedule = !!existingInterviewData;  // Check if we're rescheduling (based on existingInterviewData)

    try {
      if (isReschedule) {
        // Dispatch reschedule interview
        console.log(formData);
        await dispatch(rescheduleInterview({ applicantId: application.applicantId, formData }));
      } else {
        // Dispatch schedule interview
        await dispatch(scheduleInterview(formData));
      }

      if (!error) {
        onSubmit(formData);  // Call onSubmit callback with the form data
        console.log('Interview scheduled/rescheduled successfully');
      } else {
        console.log('Failed to schedule/reschedule interview');
      }
    } catch (err) {
      console.error('Error scheduling/rescheduling interview:', err);
    }
  };

  useEffect(() => {
    // Reset interview data on component unmount or change
    return () => {
      dispatch(resetInterviewData());
    };
  }, [dispatch]);

  return (
    <Box sx={{ padding: 3, maxWidth: '700px', margin: '0 auto', backgroundColor: 'white', boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        {existingInterviewData ? 'Reschedule Interview' : 'Schedule Interview'}
      </Typography>

      <Grid container spacing={3}>
        {/* Display Applicant Details */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Applicant ID"
            value={application.applicantId}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            value={application.fullName}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Role"
            value={application.role}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            value={application.candidateEmail}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {/* Interview Scheduling Form */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Interview Date"
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Interview Time"
            type="time"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Interview Mode</InputLabel>
            <Select value={interviewMode} onChange={(e) => setInterviewMode(e.target.value)}>
              <MenuItem value="In-person">In-person</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Interviewer</InputLabel>
            <Select value={selectedInterviewer} onChange={(e) => setSelectedInterviewer(e.target.value)}>
              {interviewers?.map((interviewer, index) => (
                <MenuItem key={index} value={interviewer}>
                  {interviewer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={generateEmailInterviewer} onChange={(e) => setGenerateEmailInterviewer(e.target.checked)} />}
            label="Generate Email to Interviewer"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={generateEmailApplicant} onChange={(e) => setGenerateEmailApplicant(e.target.checked)} />}
            label="Generate Email to Applicant"
          />
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              minWidth: '150px',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
            }}
          >
            {existingInterviewData ? 'Reschedule Interview' : 'Schedule Interview'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outlined"
            color="secondary"
            sx={{
              minWidth: '150px',
              padding: '10px 20px',
              borderRadius: '25px',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleForm;
