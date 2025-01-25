"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setErrors } from "../../redux/slices/CreateformSlice";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Box,
  Paper,
  InputLabel,
  Divider,
  Snackbar,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
} from "@mui/material";
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import axios from "axios";

const initialFormState = {
  jobTitle: "",
  description: "",
  publishDate: "",
  expiryDate: "",
  jobCategory: "",
  noOfPositions: "",
};

export default function CreateNotice() {
  const dispatch = useDispatch();
  const { formData, errors } = useSelector((state) => state.form);
  const [token, setToken] = useState('');
  const [formats, setFormats] = useState([]); 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleFormatChange = (event, newFormats) => {
    setFormats(newFormats || []); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const resetForm = () => {
    // Reset all form fields to initial state
    Object.keys(initialFormState).forEach(key => {
      dispatch(setFormData({ [key]: initialFormState[key] }));
    });
    dispatch(setErrors({}));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job Title is required.";
      formIsValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required.";
      formIsValid = false;
    }

    if (!formData.publishDate) {
      newErrors.publishDate = "Publish Date is required.";
      formIsValid = false;
    }

    if (!formData.expiryDate || formData.expiryDate <= formData.publishDate) {
      newErrors.expiryDate =
        formData.expiryDate <= formData.publishDate
          ? "Expire Date must be later than Publish Date."
          : "Expire Date is required.";
      formIsValid = false;
    }

    if (!formData.jobCategory) {
      newErrors.jobCategory = "Job Category is required.";
      formIsValid = false;
    }

    if (!formData.noOfPositions || formData.noOfPositions <= 0) {
      newErrors.noOfPositions = "Number of Positions must be greater than 0.";
      formIsValid = false;
    }

    dispatch(setErrors(newErrors));
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields correctly.',
        severity: 'error'
      });
      return;
    }

    try {
      if (!token) {
        setSnackbar({
          open: true,
          message: 'You must be logged in to submit the form.',
          severity: 'error'
        });
        return;
      }

      const response = await axios.post(
        "http://192.168.42.186:8000/api/hrms/savejobnotice",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      if (response.status === 201) {
        setSnackbar({
          open: true,
          message: 'Job notice created successfully!',
          severity: 'success'
        });
        resetForm();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || 'Failed to create job notice.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'An error occurred while submitting the form.',
        severity: 'error'
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        py: 4,
        px: { xs: 2, md: 4 }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 800,
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid #eee'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid #eee',
            backgroundColor: 'white'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            Create Job Notice
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              mt: 1
            }}
          >
            Fill in the details below to create a new job notice
          </Typography>
        </Box>

        {/* Form Content */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          {/* Job Title */}
          <TextField
            fullWidth
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fff'
              }
            }}
          />

          {/* Description */}
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: errors.description ? '#d32f2f' : 'rgba(0, 0, 0, 0.6)'
              }}
            >
              Job Description
            </Typography>
            
            {/* Formatting Toolbar */}
            <Paper 
              elevation={0} 
              sx={{ 
                mb: 1, 
                p: 1, 
                backgroundColor: '#f8f9fa',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                gap: 1
              }}
            >
              <ToggleButtonGroup
                size="small"
                value={formats}
                onChange={handleFormatChange}
                aria-label="text formatting"
              >
                <ToggleButton 
                  value="bold" 
                  aria-label="bold"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Tooltip title="Bold">
                    <FormatBoldIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="italic" 
                  aria-label="italic"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Tooltip title="Italic">
                    <FormatItalicIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="underlined" 
                  aria-label="underlined"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Tooltip title="Underline">
                    <FormatUnderlinedIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider orientation="vertical" flexItem />

              <ToggleButtonGroup
                size="small"
                exclusive
                value={formats}
                onChange={handleFormatChange}
                aria-label="list formatting"
              >
                <ToggleButton 
                  value="bullet" 
                  aria-label="bullet list"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Tooltip title="Bullet List">
                    <FormatListBulletedIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton 
                  value="number" 
                  aria-label="numbered list"
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <Tooltip title="Numbered List">
                    <FormatListNumberedIcon fontSize="small" />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <Tooltip title="Clear Formatting">
                <IconButton 
                  size="small"
                  onClick={() => setFormats([])}
                  sx={{
                    ml: 'auto',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <FormatClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Paper>

            {/* Description TextField */}
            <TextField
              fullWidth
              multiline
              rows={6}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Enter job description..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  ...((formats || []).includes('bold') && {
                    '& textarea': {
                      fontWeight: 'bold',
                    }
                  }),
                  ...((formats || []).includes('italic') && {
                    '& textarea': {
                      fontStyle: 'italic',
                    }
                  }),
                  ...((formats || []).includes('underlined') && {
                    '& textarea': {
                      textDecoration: 'underline',
                    }
                  }),
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderTop: 0,
                }
              }}
            />
          </Box>

          {/* Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Job Category */}
            <FormControl 
              fullWidth 
              error={!!errors.jobCategory}
              sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}
            >
              <InputLabel>Job Category</InputLabel>
              <Select
                value={formData.jobCategory}
                onChange={handleInputChange}
                name="jobCategory"
                label="Job Category"
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="intern">Software Engineer</MenuItem>
                <MenuItem value="full-time">Frontend Developer</MenuItem>
                <MenuItem value="flexible">Backend Developer</MenuItem>
                <MenuItem value="part-time">Data Analyst</MenuItem>
              </Select>
              {errors.jobCategory && (
                <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                  {errors.jobCategory}
                </Typography>
              )}
            </FormControl>

            {/* Number of Positions */}
            <TextField
              label="Number of Positions"
              name="noOfPositions"
              type="number"
              value={formData.noOfPositions}
              onChange={handleInputChange}
              error={!!errors.noOfPositions}
              helperText={errors.noOfPositions}
              sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}
            />
          </Box>

          {/* Dates Row */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {/* Publish Date */}
            <TextField
              label="Publish Date"
              name="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={handleInputChange}
              error={!!errors.publishDate}
              helperText={errors.publishDate}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}
            />

            {/* Expiry Date */}
            <TextField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              InputLabelProps={{ shrink: true }}
              sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' } }}
            />
          </Box>

          {/* Submit Button */}
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: '160px',
                height: '45px',
                backgroundColor: 'black',
                color: 'white',
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                borderRadius: '8px',
                boxShadow: 'none',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#333',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: 'none',
                },
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(255,255,255,0.1), transparent)',
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                },
                '&:hover::after': {
                  opacity: 1,
                }
              }}
            >
              Create Job Notice
            </Button>
          </Box>
        </Box>
      </Paper>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
