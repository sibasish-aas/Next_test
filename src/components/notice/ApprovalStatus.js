'use client';

import React, { useState, useEffect } from 'react';
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
import Pagination from '../Pagination'; // Import Pagination component
import EditJobNoticeForm from './EditJobNoticeForm'; // Import the Edit form
import { motion } from 'framer-motion';
import { Card, CardContent } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import GroupIcon from '@mui/icons-material/Group';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useRouter } from 'next/navigation'; // For Next.js navigation
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { fetchNotices, setSelectedNotice, clearSelectedNotice, updateNoticeStatus, resetUpdateSuccess } from '../../redux/slices/noticeSlice';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const role = localStorage.getItem('role');

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






  {role === 'CPC' ? (
      <Box
        sx={{
          p: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {selectedNotice?.status === 'Approved' || selectedNotice?.status === 'Rejected' ? (
          // Show stored feedback for approved/rejected notices
          <Typography
            variant="body1"
            sx={{
              p: 2,
              bgcolor: 'white',
              borderRadius: 1,
              border: '1px solid rgba(0,0,0,0.1)',
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
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 3,
              pt: 3,
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}
          >
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
                fontWeight: 600,
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
                fontWeight: 600,
              }}
            >
              Reject Notice
            </Button>
          </Box>
        )}
      </Box>
    ) : (
      <Typography variant="body1">
        {selectedNotice?.feedback || 'No feedback available.'}
      </Typography>
    )}

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
}));

// View Modal Component
const ViewModal = ({ open, onClose, selectedNotice, router }) => {
  const dispatch = useDispatch();
  const { loading, updateSuccess } = useSelector(state => state.notices.updateSuccess);
  const [feedback, setFeedback] = useState('');
  const [isOpen, setIsOpen] = useState(open);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(fetchNotices());
      //console.log('Fetching updated notices...');
      setTimeout(() => {
        onClose();
        setIsOpen(false);
        setEditModalOpen(false);
        dispatch(resetUpdateSuccess()); // Reset the success flag
      }, 1500);
    }
  }, [updateSuccess, dispatch, onClose]);

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleAccept = async () => {
    if (!selectedNotice?.jobNoticeId || !feedback.trim()) {
      showNotification('Please provide feedback before accepting', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(updateNoticeStatus({
        jobNoticeId: selectedNotice.jobNoticeId,
        feedback: feedback.trim(),
        status: 'Approved'
      })).unwrap();
      
      showNotification('Notice accepted successfully');
      // Data refresh is handled by useEffect
    } catch (error) {
      console.error('Error accepting notice:', error);
      showNotification(error.message || 'Failed to accept notice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedNotice?.jobNoticeId || !feedback.trim()) {
      showNotification('Please provide feedback before rejecting', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await dispatch(updateNoticeStatus({
        jobNoticeId: selectedNotice.jobNoticeId,
        feedback: feedback.trim(),
        status: 'Rejected'
      })).unwrap();
      
      showNotification('Notice rejected successfully');
      // Data refresh is handled by useEffect
    } catch (error) {
      console.error('Error rejecting notice:', error);
      showNotification(error.message || 'Failed to reject notice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleCreateJob = () => {
    if (selectedNotice?.jobNoticeId) {
      router.push(`/create-job?jobId=${selectedNotice.jobId}`);
    } else {
      toast.error('No job notice ID available');
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
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
            onClick={onClose}
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

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default function ApprovalStatus() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { 
    items: notices, 
    loading, 
    error,
    selectedNotice
  } = useSelector((state) => {
    //console.log('Current Redux State:', state.notices);
    return state.notices;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const itemsPerPage = 10;
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchNotices());
    //console.log("fetch start");
  }, [dispatch]);

  const handleViewClick = (notice) => {
    dispatch(setSelectedNotice(notice));
    setViewModalOpen(true);
  };

  const handleEditClick = (notice) => {
    dispatch(setSelectedNotice(notice));
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    console.log("button works")
    dispatch(clearSelectedNotice());
    setViewModalOpen(false);
    setEditModalOpen(false);
  };
  const handleModalClose2 = () => {
    console.log("button works2")
    dispatch(clearSelectedNotice());
    setEditModalOpen(false);
  };

  // Add safety check for notices
  const paginatedNotices = Array.isArray(notices) 
    ? notices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handleSave = () => {
    setEditModalOpen(false);
    // Refresh the notices list
    dispatch(fetchNotices());
    setOpenSnackbar(true);
  };

  if (loading) return <CircularProgress />;
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
              {paginatedNotices.length > 0 ? (
                paginatedNotices.map((notice, index) => (
                  <TableRow
                    key={notice.jobNoticeId}
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
                              : notice.status === 'pejected'
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

        {/* Pagination */}
        {paginatedNotices.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil((notices?.length || 0) / itemsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
            />
          </Box>
        )}
      </Paper>

      {/* View Modal */}
      <ViewModal
        open={viewModalOpen}
        onClose={handleModalClose}
        selectedNotice={selectedNotice}
        router={router}
      />

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleModalClose}
        maxWidth="lg"
        fullWidth
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: '80%' } }}
      >
        <DialogActions onClick={handleModalClose2} sx={{ position: 'absolute', top: '30px', right: '20px', zIndex:9999999 }}>
          <IconButton  color="primary">
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent>
          {selectedNotice && <EditJobNoticeForm notice={selectedNotice}  onSave={handleSave} setEditModalOpen={setEditModalOpen} />}
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            bgcolor: 'black',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          Job notice updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
