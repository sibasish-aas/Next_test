"use client"
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from 'next/navigation';
import { createJobApi } from '../../api/createJobApi';
import {
  fetchSkills,
  fetchJobRoles,
  fetchInterviewRounds,
  saveJob,
  resetState,
  selectJobState,
  fetchNoticeById
} from "../../redux/slices/jobSlice";

import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  OutlinedInput,
  ListItemText,
  FormHelperText
} from "@mui/material";

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import DOMPurify from "dompurify";

const CreateNewJob = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobNoticeId = searchParams.get("jobId");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    skills = [],
    jobRoles = [],
    interviewRounds = [],
    noticeData = null,
    error = null,
    success = false
  } = useSelector(selectJobState);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchSkills()),
          dispatch(fetchJobRoles()),
          dispatch(fetchInterviewRounds())
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch, mounted]);

  useEffect(() => {
    console.log('Current Skills State:', skills);
    console.log('Current Job Roles State:', jobRoles);
    console.log('Current Interview Rounds State:', interviewRounds);
  }, [skills, jobRoles, interviewRounds]);

  const [formData, setFormData] = useState({
    jobId: '',
    jobTitle: '',
    jobRole: '',
    jobCategory: '',
    jobDescription: '',
    experience: '',
    skills: [],
    workingSchedule: '',
    interviewType: '',
    location: '',
    numberOfVacancies: '',
    salary: '',
    publishDate: '',
    expiredDate: '',
    interviewRounds: [],
    interviewRoundNames: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!mounted || !jobNoticeId) return;
    dispatch(fetchNoticeById(jobNoticeId));
  }, [dispatch, jobNoticeId, mounted]);

  useEffect(() => {
    if (noticeData && mounted) {
      setFormData(prev => ({
        ...prev,
        jobId: jobNoticeId || '',
        jobTitle: noticeData.jobTitle || '',
        jobCategory: noticeData.jobCategory || '',
        jobDescription: noticeData.description || '',
        numberOfVacancies: noticeData.noOfPositions || '',
        publishDate: noticeData.publishDate?.split('T')[0] || '',
        expiredDate: noticeData.expiryDate?.split('T')[0] || '',
        skills: [],
        jobRole: '',
        interviewRounds: [],
        experience: '',
        workingSchedule: '',
        interviewType: '',
        location: '',
        salary: ''
      }));
    }
  }, [noticeData, jobNoticeId, mounted]);

  const handleJobDescriptionFormat = (format) => {
    const textarea = document.getElementById('jobDescription');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.jobDescription.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'bullet':
        formattedText = `\n• ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newDescription = formData.jobDescription.substring(0, start) +
      formattedText +
      formData.jobDescription.substring(end);

    setFormData(prev => ({
      ...prev,
      jobDescription: newDescription
    }));
  };

  const [selectedJobRoleId, setSelectedJobRoleId] = useState(null);

  const handleJobRoleChange = async (event) => {
    const selectedRole = event.target.value;
    const selectedRoleData = jobRoles.find(role => role.jobRole === selectedRole);

    // Get the interview round names instead of just IDs
    const selectedRoundNames = selectedRoleData 
      ? selectedRoleData.interviewRounds
          .map(roundId => {
            const round = interviewRounds.find(r => r.roundId === parseInt(roundId));
            return round ? round.roundName : null;
          })
          .filter(name => name !== null)
      : [];

    setFormData(prev => ({
      ...prev,
      jobRole: selectedRole,
      interviewRounds: selectedRoleData ? selectedRoleData.interviewRounds.map(String) : [],
      interviewRoundNames: selectedRoundNames // Add this to store round names
    }));

    setSelectedJobRoleId(selectedRoleData ? selectedRoleData.jobRoleId : null);
  };

  const containsURL = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
    return urlPattern.test(text);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'interviewRounds') {
      const roundId = parseInt(value);
      setFormData(prev => ({
        ...prev,
        interviewRounds: checked 
          ? [...prev.interviewRounds, roundId.toString()]
          : prev.interviewRounds.filter(id => id !== roundId.toString())
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      if (['jobTitle', 'jobDescription', 'location', 'salary'].includes(name) && containsURL(value)) {
        setErrors(prev => ({
          ...prev,
          [name]: 'URLs or web links are not allowed in this field'
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }

      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOptions
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    const textFields = {
      jobTitle: 'Job Title',
      jobDescription: 'Job Description',
      location: 'Location',
      salary: 'Salary'
    };

    Object.entries(textFields).forEach(([field, label]) => {
      if (containsURL(formData[field])) {
        newErrors[field] = `${label} cannot contain URLs or web links`;
      }
    });

    if (!formData.jobTitle) newErrors.jobTitle = 'Please enter Job Title';
    if (!formData.jobRole) newErrors.jobRole = 'Please select Job Role';
    if (!formData.jobCategory) newErrors.jobCategory = 'Please enter Job Category';
    if (!formData.jobDescription) newErrors.jobDescription = 'Please enter Job Description';
    if (!formData.experience) newErrors.experience = 'Please enter Experience Required';
    if (formData.skills.length === 0) newErrors.skills = 'Please select at least one Skill';
    if (!formData.workingSchedule) newErrors.workingSchedule = 'Please enter Working Schedule';
    if (!formData.interviewType) newErrors.interviewType = 'Please enter Interview Type';
    if (!formData.location) newErrors.location = 'Please enter Location';
    if (!formData.numberOfVacancies) newErrors.numberOfVacancies = 'Please enter Number of Vacancies';
    if (!formData.salary) newErrors.salary = 'Please enter Salary';
    if (!formData.publishDate) newErrors.publishDate = 'Please enter Publish Date';
    if (!formData.expiredDate) newErrors.expiredDate = 'Please enter Expired Date';
    if (formData.interviewRounds.length === 0) newErrors.interviewRounds = 'Please select at least one Interview Round';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      // No need to convert interview rounds as we're already storing IDs
      const jobData = {
        ...formData,
        jobId: jobNoticeId || formData.jobId,
      };

      console.log('Submitting job data:', jobData);
      await dispatch(saveJob(jobData)).unwrap();
      // toast.success('Job created successfully!');
      router.push('/manage-job');
    } catch (error) {
      console.error('Error creating job:', error);
      // toast.error(error.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        p: { xs: 2, md: 4 },
        bgcolor: '#F8FAFC',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          bgcolor: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          maxWidth: '1000px',
          width: '100%'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: '#1E293B',
              mb: 1
            }}
          >
            Create New Job
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748B',
              fontSize: '0.95rem'
            }}
          >
            Fill in the details below to create a new job posting
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* First Row: Job ID and Title */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Job ID"
              name="jobId"
              value={jobNoticeId}
              disabled
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#F1F5F9',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
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
              error={!!errors.jobTitle}
              helperText={errors.jobTitle}
              InputLabelProps={{
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>

          {/* Second Row: Job Role and Interview Rounds */}
          <Grid item xs={12} md={6}>
            <FormControl 
              fullWidth 
              error={!!errors.jobRole}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            >
              <InputLabel sx={{ color: '#64748B' }}>Job Role</InputLabel>
              <Select
                name="jobRole"
                value={formData.jobRole}
                onChange={handleJobRoleChange}
                label="Job Role"
              >
                {Array.isArray(jobRoles) && jobRoles.map((role) => (
                  <MenuItem key={role._id} value={role.jobRole}>
                    {role.jobRole}
                  </MenuItem>
                ))}
              </Select>
              {errors.jobRole && (
                <FormHelperText>{errors.jobRole}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Interview Rounds"
              value={formData.interviewRoundNames ? formData.interviewRoundNames.join(', ') : ''}
              disabled
              multiline
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#F1F5F9',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>

          {/* Third Row: Skills (Full Width) */}
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.skills}>
              <InputLabel sx={{ color: '#64748B' }}>Skills Required</InputLabel>
              <Select
                multiple
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                label="Skills Required"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value}
                        sx={{
                          bgcolor: '#F1F5F9',
                          color: '#0F172A',
                          fontWeight: 500,
                          border: '1px solid #E2E8F0',
                          '& .MuiChip-label': {
                            px: 1.5
                          },
                          '&:hover': {
                            bgcolor: '#E2E8F0'
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              >
                {Array.isArray(skills) && skills.map((skill) => (
                  <MenuItem
                    key={skill._id}
                    value={skill.skill}
                    sx={{
                      borderRadius: '8px',
                      mx: 1,
                      my: 0.5,
                      '&:hover': {
                        bgcolor: '#F1F5F9'
                      }
                    }}
                  >
                    {skill.skill}
                  </MenuItem>
                ))}
              </Select>
              {errors.skills && (
                <FormHelperText>{errors.skills}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Fourth Row: Job Category and Experience */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.jobCategory}>
              <InputLabel sx={{ color: '#64748B' }}>Job Category</InputLabel>
              <Select
                name="jobCategory"
                value={formData.jobCategory}
                onChange={handleInputChange}
                label="Job Category"
              >
                <MenuItem value="intern">Intern</MenuItem>
                <MenuItem value="full-time">Full-Time</MenuItem>
                <MenuItem value="part-time">Part-Time</MenuItem>
                <MenuItem value="contract">Contract</MenuItem>
              </Select>
              {errors.jobCategory && (
                <FormHelperText>{errors.jobCategory}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.experience}>
              <InputLabel sx={{ color: '#64748B' }}>Experience Level</InputLabel>
              <Select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                label="Experience Level"
              >
                <MenuItem value="Fresher">Fresher</MenuItem>
                <MenuItem value="1-3 Years">1-3 Years</MenuItem>
                <MenuItem value="3-5 Years">3-5 Years</MenuItem>
                <MenuItem value="5+ Years">5+ Years</MenuItem>
              </Select>
              {errors.experience && (
                <FormHelperText>{errors.experience}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Fifth Row: Working Schedule and Interview Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.workingSchedule}>
              <InputLabel sx={{ color: '#64748B' }}>Working Schedule</InputLabel>
              <Select
                name="workingSchedule"
                value={formData.workingSchedule}
                onChange={handleInputChange}
                label="Working Schedule"
              >
                <MenuItem value="9-to-5">10 AM - 7 PM</MenuItem>
                <MenuItem value="flexible">Flexible</MenuItem>
                <MenuItem value="shifts">Shifts</MenuItem>
              </Select>
              {errors.workingSchedule && (
                <FormHelperText>{errors.workingSchedule}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.interviewType}>
              <InputLabel sx={{ color: '#64748B' }}>Interview Type</InputLabel>
              <Select
                name="interviewType"
                value={formData.interviewType}
                onChange={handleInputChange}
                label="Interview Type"
              >
                <MenuItem value="face-to-face">Face to Face</MenuItem>
                <MenuItem value="virtual">Virtual</MenuItem>
              </Select>
              {errors.interviewType && (
                <FormHelperText>{errors.interviewType}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Sixth Row: Location and Vacancies */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              InputLabelProps={{
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
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
              value={formData.numberOfVacancies}
              onChange={handleInputChange}
              error={!!errors.numberOfVacancies}
              helperText={errors.numberOfVacancies}
              type="number"
              InputLabelProps={{
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>

          {/* Seventh Row: Publish Date and Expiry Date */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Publish Date"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              error={!!errors.publishDate}
              helperText={errors.publishDate}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="date"
              label="Expiry Date"
              name="expiredDate"
              value={formData.expiredDate}
              onChange={handleInputChange}
              error={!!errors.expiredDate}
              helperText={errors.expiredDate}
              InputLabelProps={{
                shrink: true,
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>

          {/* Eighth Row: Salary */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              error={!!errors.salary}
              helperText={errors.salary}
              InputLabelProps={{
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
            />
          </Grid>

          {/* Ninth Row: Job Description (Full Width) */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Tooltip title="Bold">
                <IconButton onClick={() => handleJobDescriptionFormat('bold')} size="small">
                  <FormatBoldIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Italic">
                <IconButton onClick={() => handleJobDescriptionFormat('italic')} size="small">
                  <FormatItalicIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Underline">
                <IconButton onClick={() => handleJobDescriptionFormat('underline')} size="small">
                  <FormatUnderlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Bullet List">
                <IconButton onClick={() => handleJobDescriptionFormat('bullet')} size="small">
                  <FormatListBulletedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TextField
              fullWidth
              id="jobDescription"
              label="Job Description"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              error={!!errors.jobDescription}
              helperText={errors.jobDescription}
              InputLabelProps={{
                sx: {
                  color: '#64748B',
                  '&.Mui-focused': {
                    color: '#0F172A'
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': {
                    borderColor: '#E2E8F0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#CBD5E1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0F172A'
                  }
                }
              }}
              multiline
              rows={4}
            />
          </Grid>

          {/* Submit Button */}
          <Grid
            item
            xs={12}
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minWidth: 200,
                py: 1.5,
                bgcolor: '#0F172A',
                color: '#fff',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#1E293B',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                },
                '&:disabled': {
                  bgcolor: '#CBD5E1'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Create Job'
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreateNewJob;
