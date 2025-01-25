'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TextField,
  Button,
  Grid,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { useDispatch, useSelector } from 'react-redux';
import { updateJobNotice, fetchNotices, resetUpdateSuccess } from '../../redux/slices/noticeSlice';
import axios from 'axios';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

// Create a client-only wrapper component
const ClientOnly = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return children;
};

const EditJobNoticeForm = ({ notice, onClose, setGlobalSnackbar }) => {
  const dispatch = useDispatch();
  const { loading, updateSuccess, error } = useSelector(state => state.notices);
  const [formData, setFormData] = useState({
    jobTitle: '',
    description: '',
    publishDate: '',
    expiryDate: '',
    jobCategory: '',
    noOfPositions: '',
  });
  const [formats, setFormats] = useState([]);

  // Initialize form data
  useEffect(() => {
    if (notice) {
      setFormData({
        jobTitle: notice.jobTitle || '',
        description: notice.description || '',
        publishDate: notice.publishDate ? notice.publishDate.slice(0, 10) : '',
        expiryDate: notice.expiryDate ? notice.expiryDate.slice(0, 10) : '',
        jobCategory: notice.jobCategory || '',
        noOfPositions: notice.noOfPositions || '',
      });
    }
  }, [notice]);

  // Add handleChange function
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Add handleFormat function if you're using text formatting
  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  const handleSubmit = async () => {
    try {
      const updatedNotice = {
        ...formData,
        jobNoticeId: notice.jobNoticeId,
        status: 'Pending',
        isApproved: false,
        feedback: '',
        _id: notice._id,
        createdAt: notice.createdAt,
        updatedAt: new Date().toISOString()
      };

      const result = await dispatch(updateJobNotice(updatedNotice)).unwrap();
      
      if (result) {
        // Close modal first
        onClose();
        
        // Show success notification
        setGlobalSnackbar({
          open: true,
          message: 'Job notice updated successfully and sent for approval',
          severity: 'success'
        });

        // Reset update success state
        setTimeout(() => {
          dispatch(resetUpdateSuccess());
        }, 500);
      }
    } catch (error) {
      setGlobalSnackbar({
        open: true,
        message: error.message || 'Failed to update job notice',
        severity: 'error'
      });
    }
  };

  const jobCategories = ['Engineering', 'Sales', 'Marketing', 'HR']; // Example categories

  return (
    <ClientOnly>
      <Box 
        component={motion.div}
        variants={formVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          padding: 3,
          minHeight: '80vh',
          position: 'relative'
        }}
      >
        {/* Header - Single Close Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            Edit Job Notice
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{
              color: 'black',
              '&:hover': { 
                backgroundColor: 'rgba(0,0,0,0.04)',
                transform: 'rotate(90deg)',
                transition: 'transform 0.3s ease'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 4, height: 'calc(100% - 140px)' }}>
          {/* Left Column - Form Fields */}
          <Box sx={{ flex: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div variants={fieldVariants}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div variants={fieldVariants}>
                  <FormControl fullWidth>
                    <InputLabel>Job Category</InputLabel>
                    <Select
                      name="jobCategory"
                      value={formData.jobCategory}
                      onChange={handleChange}
                      label="Job Category"
                    >
                      {jobCategories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div variants={fieldVariants}>
                  <TextField
                    fullWidth
                    label="No. of Positions"
                    name="noOfPositions"
                    type="number"
                    value={formData.noOfPositions}
                    onChange={handleChange}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div variants={fieldVariants}>
                  <TextField
                    fullWidth
                    label="Publish Date"
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div variants={fieldVariants}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Right Column - Rich Text Description */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <motion.div 
              variants={fieldVariants}
              style={{ height: '100%' }}
            >
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Description
              </Typography>
              
              <Box sx={{ 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 1,
                bgcolor: 'white',
                overflow: 'hidden'
              }}>
                {/* Formatting Toolbar */}
                <Box sx={{ 
                  p: 1, 
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  bgcolor: 'rgba(0,0,0,0.02)'
                }}>
                  <ToggleButtonGroup
                    value={formats}
                    onChange={handleFormat}
                    aria-label="text formatting"
                    size="small"
                  >
                    <ToggleButton value="bold" aria-label="bold" disableRipple>
                      <FormatBoldIcon />
                    </ToggleButton>
                    <ToggleButton value="italic" aria-label="italic" disableRipple>
                      <FormatItalicIcon />
                    </ToggleButton>
                    <ToggleButton value="underlined" aria-label="underlined" disableRipple>
                      <FormatUnderlinedIcon />
                    </ToggleButton>
                    <ToggleButton value="bullet" aria-label="bullet list" disableRipple>
                      <FormatListBulletedIcon />
                    </ToggleButton>
                    <ToggleButton value="number" aria-label="numbered list" disableRipple>
                      <FormatListNumberedIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                {/* Text Area */}
                <TextField
                  multiline
                  fullWidth
                  minRows={10}
                  maxRows={20}
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Enter detailed job description..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      borderRadius: 0,
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover fieldset': {
                        border: 'none'
                      },
                      '&.Mui-focused fieldset': {
                        border: 'none'
                      }
                    },
                    '& .MuiInputBase-input': {
                      p: 2,
                      fontWeight: formats.includes('bold') ? 'bold' : 'normal',
                      fontStyle: formats.includes('italic') ? 'italic' : 'normal',
                      textDecoration: formats.includes('underlined') ? 'underline' : 'none',
                    }
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Save Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: 'black',
              '&:hover': { bgcolor: '#333' }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </ClientOnly>
  );
};

// Export with dynamic import to disable SSR for this component
export default dynamic(() => Promise.resolve(EditJobNoticeForm), {
  ssr: false
});
