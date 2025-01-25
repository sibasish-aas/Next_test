"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchJobs,
  updateJob,
  fetchJobRoles,
  fetchInterviewRounds
} from '../../redux/slices/jobSlice';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Chip
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const EditJobContent = ({ jobId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    jobs,
    loading,
    error,
    updateError,
    jobRoles,
    interviewRounds
  } = useSelector((state) => ({
    jobs: state.jobs.jobs || [],
    loading: state.jobs.loading?.jobs || false,
    error: state.jobs.error,
    updateError: state.jobs.updateError,
    jobRoles: state.jobs.jobRoles || [],
    interviewRounds: state.jobs.interviewRounds || []
  }));

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobId: '',
    jobDescription: '',
    jobRole: '',
    jobCategory: '',
    experience: '',
    numberOfVacancies: '',
    workingSchedule: '',
    interviewType: '',
    location: '',
    salary: '',
    skills: [],
    publishDate: '',
    expiredDate: '',
    interviewRounds: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all necessary data first
        await Promise.all([
          dispatch(fetchJobs()),
          dispatch(fetchJobRoles()),
          dispatch(fetchInterviewRounds())
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (jobs?.length > 0 && jobId && jobRoles.length > 0 && interviewRounds.length > 0) {
      const job = jobs.find(j => j.jobId === jobId);
      if (job) {
        // Find the job role ID when loading the job
        const selectedRole = jobRoles.find(role => role.jobRole === job.jobRole[0]);
        const roleId = selectedRole?.jobRoleId;
        setSelectedJobRoleId(roleId);

        // Format dates from ISO string
        const formatDate = (dateString) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        // Handle interview rounds from the API format
        const getInterviewRounds = (rounds) => {
          if (!rounds) return [];
          if (Array.isArray(rounds)) {
            // Handle array of objects with roundId and roundName
            if (rounds.length > 0 && typeof rounds[0] === 'object' && 'roundId' in rounds[0]) {
              return rounds.map(round => round.roundId.toString());
            }
            // Handle array of numbers
            return rounds.map(round => round.toString());
          }
          return [];
        };

        setSelectedJob(job);
        setFormData({
          jobTitle: job.jobTitle || '',
          jobId: job.jobId || '',
          jobDescription: job.jobDescription || '',
          jobRole: job.jobRole[0] || '',
          jobCategory: job.jobCategory || '',
          experience: job.experience || '',
          numberOfVacancies: job.numberOfVacancies || '',
          workingSchedule: job.workingSchedule || '',
          interviewType: job.interviewType || '',
          location: job.location || '',
          salary: job.salary || '',
          skills: job.skills || [],
          publishDate: formatDate(job.publishDate),
          expiredDate: formatDate(job.expiredDate),
          interviewRounds: getInterviewRounds(job.interviewRounds)
        });

        console.log('Initial job data:', job);
        console.log('Selected role:', job.jobRole[0]);
        console.log('Raw interview rounds:', job.interviewRounds);
        console.log('Processed interview rounds:', getInterviewRounds(job.interviewRounds));
      }
    }
  }, [jobs, jobId, jobRoles, interviewRounds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'jobRole') {
      const selectedRole = jobRoles.find(role => role.jobRole === value);
      const roleId = selectedRole?.jobRoleId;
      setSelectedJobRoleId(roleId);
  
      // Get the interview rounds for this role
      const roleRounds = interviewRounds.filter(round => 
        round.jobRoleId === roleId
      );
  
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Automatically set interview rounds for the selected role
        interviewRounds: roleRounds.map(round => round.roundId.toString())
      }));

      console.log('Selected new role:', value);
      console.log('New role rounds:', roleRounds);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const showToast = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setOpenToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        // Keep the interview rounds as array of indices
        interviewRounds: formData.interviewRounds
      };

      await dispatch(updateJob({ jobId: formData.jobId, jobData: dataToSubmit })).unwrap();
      showToast('Job updated successfully!');
      setTimeout(() => {
        router.push('/manage-job');
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Failed to update job', 'error');
    }
  };

  // Filter interview rounds based on selected job role
  const filteredInterviewRounds = interviewRounds.filter(round => 
    round.jobRoleId === selectedJobRoleId
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!selectedJob && !loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="info">Loading job details...</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            fontWeight: 700,
            color: '#1a237e',
            borderBottom: '2px solid #1a237e',
            paddingBottom: 1,
            display: 'inline-block'
          }}
        >
          Edit Job
        </Typography>

        {updateError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {updateError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job ID"
                name="jobId"
                value={formData.jobId}
                disabled
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    '&.Mui-disabled': {
                      backgroundColor: '#f0f0f0'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
          
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              >
                <InputLabel>Job Role</InputLabel>
                <Select
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  label="Job Role"
                >
                  {jobRoles.map((role) => (
                    <MenuItem key={role.id} value={role.jobRole}>
                      {role.jobRole}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Job Category"
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Experience Required"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Number of Vacancies"
                name="numberOfVacancies"
                type="number"
                value={formData.numberOfVacancies}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Working Schedule"
                name="workingSchedule"
                value={formData.workingSchedule}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interview Type"
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Publish Date"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                name="expiredDate"
                type="date"
                value={formData.expiredDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#1a237e',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a237e',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '8px',
                  p: 2,
                  minHeight: '56px',
                  position: 'relative',
                  bgcolor: '#f8f9fa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#1a237e',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '-9px',
                    left: '10px',
                    bgcolor: '#ffffff',
                    px: 1,
                    fontSize: '0.75rem',
                    color: '#1a237e',
                    fontWeight: 500
                  }}
                >
                  Interview Rounds
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.interviewRounds?.map((roundId) => {
                    const round = interviewRounds.find(r => r.roundId.toString() === roundId);
                    return round ? (
                      <Chip
                        key={round.roundId}
                        label={round.roundName}
                        sx={{
                          bgcolor: '#e8eaf6',
                          borderRadius: '6px',
                          '& .MuiChip-label': {
                            color: '#1a237e',
                            fontWeight: 500
                          }
                        }}
                      />
                    ) : null;
                  })}
                  {(!formData.interviewRounds || formData.interviewRounds.length === 0) && (
                    <Typography color="textSecondary" fontSize="0.875rem">
                      No interview rounds selected
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                bgcolor: '#000000',
                color: '#fff',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { 
                  bgcolor: '#G32F2F',
                 
                  boxShadow: '0 4px 12px rgba(211,47,47,0.2)'
                }
              }}
            >
              Save Changes
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/manage-job')}
              sx={{
                borderColor: '#F44336',
                color: '#F44336',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#F44336',
                  bgcolor: 'rgba(26,35,126,0.04)',
                  boxShadow: '0 4px 12px rgba(26,35,126,0.1)'
                }
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={openToast}
        autoHideDuration={1000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
        >
          {toastMessage}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

const EditJob = ({ jobId }) => {
  if (!jobId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">No job ID provided</Alert>
      </Box>
    );
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <EditJobContent jobId={jobId} />
    </Suspense>
  );
};

export default EditJob;
