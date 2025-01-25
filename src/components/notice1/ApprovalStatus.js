'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  DialogActions, 
  DialogContent, 
  Dialog, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography, 
  Button, 
  DialogTitle,  
  CardActions, 
  TextField, 
  Grid, 
  Paper, 
  CircularProgress, 
  Snackbar, 
  Alert,
  AppBar,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility'; // View Icon
import EditIcon from '@mui/icons-material/Edit'; // Edit Icon
// import { setJobNotices, setStatus, setError } from '../../redux/slices/jobNoticeSlice'; // Adjust the import path if needed

import JobNoticeView from './JobNoticeView'; // A component that will show all job notice details
import EditJobNoticeForm from './EditJobNoticeForm'; // Import the Edit form
import { motion } from 'framer-motion';
import { Card, CardContent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { format } from 'date-fns'; // For date formatting
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/navigation'; // For Next.js navigation
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fetchNotices, updateNoticeStatus, setSelectedNotice, clearSelectedNotice, updateJobNotice } from '../../redux/slices/noticeSlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';


// const role = localStorage.getItem('role');

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


const DateInfoCard = ({ icon, label, date }) => (
  <motion.div
    whileHover={{ y: -2 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        bgcolor: 'white',
        px: 3,
        py: 1.5,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ color: 'primary.main' }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="subtitle2" fontWeight="bold">
          {formatDate(date)}
        </Typography>
      </Box>
    </Box>
  </motion.div>
);

const JobDetailsCard = ({ selectedNotice }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    whileHover={{ 
      y: -4,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    }}
    sx={{ 
      mb: 3,
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Job Details
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { icon: <WorkIcon />, label: "Position:", value: selectedNotice?.jobTitle },
          { icon: <BusinessIcon />, label: "Category:", value: selectedNotice?.jobCategory },
          { icon: <GroupIcon />, label: "Vacancies:", value: selectedNotice?.noOfPositions },
          { icon: <LocationOnIcon />, label: "Location:", value: selectedNotice?.location || 'Not specified' }
        ].map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ color: 'black' }}>{item.icon}</Box>
            <Typography>
              <strong>{item.label}</strong> {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

const SimpleDescriptionCard = ({ selectedNotice }) => (
  <Card
    component={motion.div}
    whileHover={{ scale: 1.01 }}
    sx={{ 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Job Description
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        {selectedNotice?.description || 'No description available.'}
      </Typography>
    </CardContent>
  </Card>
);

const FeedbackSection = ({ selectedNotice, feedback, setFeedback, handleAccept, handleReject }) => (
  <Card
    component={motion.div}
    whileHover={{ scale: 1.01 }}
    sx={{ 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity }
          }}
        >
          <AssignmentTurnedInIcon sx={{ color: 'black' }} />
        </motion.div>
        <Typography variant="h6" fontWeight="bold">
          Feedback
        </Typography>
        
        <Box sx={{
          ml: 'auto',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.75rem',
          fontWeight: 500,
          bgcolor: selectedNotice?.status === 'Approved' 
            ? 'rgba(46, 204, 113, 0.1)'
            : selectedNotice?.status === 'Rejected'
            ? 'rgba(231, 76, 60, 0.1)'
            : 'rgba(241, 196, 15, 0.1)',
          color: selectedNotice?.status === 'Approved'
            ? '#27ae60'
            : selectedNotice?.status === 'Rejected'
            ? '#c0392b'
            : '#f39c12'
        }}>
          {selectedNotice?.status === 'Approved' ? 
            <CheckCircleIcon sx={{ fontSize: '0.875rem' }} /> : 
            selectedNotice?.status === 'Rejected' ?
            <CancelIcon sx={{ fontSize: '0.875rem' }} /> :
            <PendingIcon sx={{ fontSize: '0.875rem' }} />
          }
          {selectedNotice?.status || 'Pending'}
        </Box>
      </Box>
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'rgba(0,0,0,0.02)', 
        borderRadius: 2,
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        {selectedNotice?.status === 'Approved' || selectedNotice?.status === 'Rejected' ? (
          // Show stored feedback for approved/rejected notices
          <Typography 
            variant="body1" 
            sx={{ 
              p: 2, 
              bgcolor: 'white',
              borderRadius: 1,
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {selectedNotice?.feedback || 'No feedback provided'}
          </Typography>
        ) : (
          // Show feedback input for pending notices
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter your feedback here..."
            variant="outlined"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        
        {/* Only show buttons if status is Pending */}
        {(!selectedNotice?.status || selectedNotice?.status === 'Pending') && (
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            mt: 3,
            pt: 3,
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleAccept}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                bgcolor: '#27ae60',
                '&:hover': { bgcolor: '#219a52' },
                fontWeight: 600
              }}
            >
              Accept Notice
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleReject}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                py: 1.5,
                bgcolor: '#e74c3c',
                '&:hover': { bgcolor: '#c0392b' },
                fontWeight: 600
              }}
            >
              Reject Notice
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mt: 2,
        pt: 2,
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {formatDate(selectedNotice?.updatedAt || selectedNotice?.publishDate)}
        </Typography>
        {selectedNotice?.reviewedBy && (
          <Typography variant="caption" color="text.secondary">
            Reviewed by: {selectedNotice.reviewedBy}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const StyledAppBar = styled(AppBar)(({ theme, $scrolled }) => ({
  backgroundColor: $scrolled ? alpha('#FFFDEC', 0.85) : '#FFFDEC',
  // ... rest of the styles remain same
}));

// View Modal Component
const ViewModal = ({ open, onClose, selectedNotice, router, setGlobalSnackbar }) => {
  const dispatch = useDispatch();
  const { loading, updateSuccess, error } = useSelector(state => state.notices);
  const [feedback, setFeedback] = useState('');

  const handleCloseModal = () => {
    setFeedback('');
    onClose();
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedNotice?.jobNoticeId || !feedback.trim()) {
      setGlobalSnackbar({
        open: true,
        message: 'Please provide feedback before updating status',
        severity: 'warning'
      });
      return;
    }

    try {
      const result = await dispatch(updateNoticeStatus({
        jobNoticeId: selectedNotice.jobNoticeId,
        feedback: feedback.trim(),
        status
      })).unwrap();

      if (result) {
        handleCloseModal(); // Close modal first
        
        // Show success notification after a short delay
        setTimeout(() => {
          setGlobalSnackbar({
            open: true,
            message: `Notice has been ${status.toLowerCase()} successfully`,
            severity: 'success'
          });
        }, 300);
      }
    } catch (error) {
      setGlobalSnackbar({
        open: true,
        message: error.message || `Failed to ${status.toLowerCase()} notice`,
        severity: 'error'
      });
    }
  };

  const handleAccept = () => handleStatusUpdate('Approved');
  const handleReject = () => handleStatusUpdate('Rejected');

const handleCreateJob = () => {
  if (selectedNotice?.jobNoticeId) {
    router.push(`/create-job?
jobId=${selectedNotice.
  jobId}`);
  } else {
    toast.error('No job notice ID available');
  }
};

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseModal} // Use the new handler
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            width: '85vw',
            height: '90vh',
            maxWidth: 'none',
            m: 2,
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: '#f8f9fa'
          }
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            position: 'relative',
            p: 3,
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          {/* Left Side - Title and Dates */}
          <Box sx={{ textAlign: 'left', pl: 6 }}> {/* Increased left padding to accommodate close button */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {selectedNotice?.jobTitle}
              </Typography>
            </motion.div>
            <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
              <motion.div
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventAvailableIcon 
                    sx={{ 
                      color: 'black',
                      animation: 'pulse 2s infinite'
                    }} 
                  />
                  <Typography>Published: {formatDate(selectedNotice?.publishDate)}</Typography>
                </Box>
              </motion.div>
              <motion.div
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EventBusyIcon 
                    sx={{ 
                      color: 'black',
                      animation: 'pulse 2s infinite',
                      animationDelay: '1s'
                    }} 
                  />
                  <Typography>Expires: {formatDate(selectedNotice?.expiryDate)}</Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>

          {/* Right Side - Status and Create Job */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            alignItems: 'center', 
            pr: 8
          }}>
            {/* <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/create-job')}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                borderRadius: '50px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#333',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              Create Job
            </Button> */}

<Button
  variant="contained"
  startIcon={<AddIcon />}
  onClick={handleCreateJob}
  sx={{
    backgroundColor: 'black',
    color: 'white',
    borderRadius: '50px',
    px: 3,
    py: 1,
    textTransform: 'none',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#333',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  }}
>
  Create Job
</Button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: selectedNotice?.status === 'Approved' 
                    ? 'rgba(46, 204, 113, 0.1)'
                    : selectedNotice?.status === 'Rejected'
                    ? 'rgba(231, 76, 60, 0.1)'
                    : 'rgba(241, 196, 15, 0.1)',
                  color: selectedNotice?.status === 'Approved'
                    ? '#27ae60'
                    : selectedNotice?.status === 'Rejected'
                    ? '#c0392b'
                    : '#f39c12'
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                </motion.div>
                {selectedNotice?.status || 'Pending'}
              </Box>
            </motion.div>
          </Box>

          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal} // Use the new handler
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'rgba(0,0,0,0.7)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)',
                transform: 'scale(1.1)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content Section */}
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <JobDetailsCard selectedNotice={selectedNotice} />
              {selectedNotice && (
                <FeedbackSection 
                  selectedNotice={selectedNotice} 
                  feedback={feedback}
                  setFeedback={setFeedback}
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                />
              )}
            </Grid>

            <Grid item xs={12} md={8}>
              <SimpleDescriptionCard 
                selectedNotice={selectedNotice}
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Move Snackbar outside of Dialog */}
    </>
  );
};

export default function ApprovalStatus() {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedNotice = useSelector((state) => state.notices.selectedNotice);
  const { items: notices, loading, error, updateSuccess, hasMore } = useSelector((state) => state.notices);
  const [page, setPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef();
  const loadingRef = useRef(false);
  const [globalSnackbar, setGlobalSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const lastNoticeElementRef = useCallback(node => {
    if (loading || loadingRef.current) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setIsIntersecting(true);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Handle intersection and page updates
  useEffect(() => {
    if (isIntersecting && hasMore && !loadingRef.current) {
      loadingRef.current = true;
      setPage(prevPage => prevPage + 1);
      setIsIntersecting(false);
    }
  }, [isIntersecting, hasMore]);

  // Initial load and subsequent page loads
  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchNotices(page));
      loadingRef.current = false;
    };
    loadData();
  }, [page, dispatch]);

  // Reset on update success
  useEffect(() => {
    if (updateSuccess) {
      setPage(1);
      loadingRef.current = false;
      dispatch({ type: 'notices/resetUpdateSuccess' });
      dispatch(fetchNotices(1));
    }
  }, [updateSuccess, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setGlobalSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  const handleViewClick = (notice) => {
    dispatch(setSelectedNotice(notice));
    setViewModalOpen(true);
  };

  const handleEditClick = (notice) => {
    dispatch(setSelectedNotice(notice));
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    dispatch(clearSelectedNotice());
  };

  const handleSave = () => {
    setEditModalOpen(false);
    setPage(1);
    dispatch(fetchNotices(1));
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ 
        p: 4,
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component={motion.h1}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a'
          }}
        >
          Notice Status
        </Typography>

        <Button
          variant="contained"
          onClick={() => router.push('/create-notice')}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '50px',
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#333',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          Create Notice
        </Button>
      </Box>

      {/* Table Section */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: 'white'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 600, py: 2 }}>Notice ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Openings</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notices && notices.length > 0 ? (
                notices.map((notice, index) => (
                  <TableRow
                    key={`${notice.jobNoticeId}-${index}`}
                    ref={index === notices.length - 1 ? lastNoticeElementRef : null}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      delay: index * 0.03
                    }}
                    whileHover={{ 
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <TableCell>{notice.jobNoticeId}</TableCell>
                    <TableCell>{notice.jobTitle}</TableCell>
                    <TableCell>{notice.jobCategory}</TableCell>
                    <TableCell>{notice.noOfPositions}</TableCell>
                    <TableCell>
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 400, damping: 17 }
                        }}
                      >
                        <Box
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderRadius: '50px',
                            display: 'inline-block',
                            backgroundColor: notice.status === 'Approved' 
                              ? 'rgba(46, 204, 113, 0.1)'
                              : notice.status === 'Rejected'
                              ? 'rgba(231, 76, 60, 0.1)'
                              : 'rgba(241, 196, 15, 0.1)',
                            color: notice.status === 'Approved'
                              ? '#27ae60'
                              : notice.status === 'Rejected'
                              ? '#c0392b'
                              : '#f39c12',
                            fontSize: '0.875rem',
                            fontWeight: 500
                          }}
                        >
                          {notice.status || 'Pending'}
                        </Box>
                      </motion.div>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleViewClick(notice)}
                          size="small"
                          sx={{ 
                            color: 'black',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                          }}
                        >
                          <RemoveRedEyeOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                        
                        {(notice.status === 'Rejected' || !notice.status || notice.status === 'Pending') && (
                          <IconButton 
                            onClick={() => handleEditClick(notice)}
                            size="small"
                            sx={{ 
                              color: 'black',
                              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                            }}
                          >
                            <EditOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No notices found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {/* ViewModal */}
      <ViewModal
        open={viewModalOpen}
        onClose={handleModalClose}
        selectedNotice={selectedNotice}
        router={router}
        setGlobalSnackbar={setGlobalSnackbar}
      />

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80%' } }}
      >
        <DialogActions sx={{ position: 'absolute', top: '10px', right: '20px' }}>
          <IconButton onClick={handleModalClose} color="primary">
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent>
          {selectedNotice && (
            <EditJobNoticeForm 
              notice={selectedNotice} 
              onClose={handleModalClose}
              setGlobalSnackbar={setGlobalSnackbar}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Global Snackbar */}
      <Snackbar
        open={globalSnackbar.open}
        autoHideDuration={3000}
        onClose={() => setGlobalSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          bottom: { xs: 90, sm: 24 }
        }}
      >
        <Alert
          onClose={() => setGlobalSnackbar(prev => ({ ...prev, open: false }))}
          severity={globalSnackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: '300px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '1rem',
            alignItems: 'center',
            bgcolor: globalSnackbar.severity === 'success' ? 'black' : 
                    globalSnackbar.severity === 'error' ? '#d32f2f' :
                    globalSnackbar.severity === 'warning' ? '#ed6c02' : undefined,
            '& .MuiAlert-icon': {
              fontSize: '24px'
            }
          }}
        >
          {globalSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
