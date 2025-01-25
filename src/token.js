eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmY3NzFmNTFkODUzZDRiYWQ2ZmU3ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNTk2MzI5MywiZXhwIjoxNzM2MDQ5NjkzfQ.eqMrB0eUB9Wsg0Lx8KpPRbyh3fqERuXpXQvElhbIPDE



'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

export default function ViewNoticeRequest() {
  const [jobNotices, setJobNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [dialogLoading, setDialogLoading] = useState(false);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NmY3NzFmNTFkODUzZDRiYWQ2ZmU3ZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNTk2MzI5MywiZXhwIjoxNzM2MDQ5NjkzfQ.eqMrB0eUB9Wsg0Lx8KpPRbyh3fqERuXpXQvElhbIPDE'; // Replace with actual token retrieval logic

  // Fetch all job notices
  const fetchJobNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/hrms/getnoticelist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.success) {
        const validNotices = response.data.data.filter((notice) => !notice.isDeleted);
        setJobNotices(validNotices);
      } else {
        alert('Unexpected data format received from the API.');
      }
    } catch (error) {
      console.error('Error fetching job notices:', error);
      alert('Failed to load job notices.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch job notice details by ID
  const fetchNoticeDetails = async (id) => {
    try {
      setDialogLoading(true);
      const response = await axios.get(`http://localhost:8000/api/hrms/getnoticelistbynoticeid/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 && response.data.success) {
        setSelectedNotice(response.data.data[0]);
      } else {
        alert('Error fetching job notice details.');
      }
    } catch (error) {
      console.error('Error fetching job notice details:', error);
      alert('Failed to load job notice details.');
    } finally {
      setDialogLoading(false);
    }
  };

  // Update job notice with feedback and status
  const updateJobNotice = async () => {
    try {
      const payload = {
        jobNoticeId: selectedNotice.jobNoticeId,
        feedback,
        status,
      };
      const response = await axios.patch(`http://localhost:8000/api/hrms/updatejobnotice`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        alert('Job notice updated successfully.');
        fetchJobNotices(); // Refresh the list
        handleCloseModal();
      } else {
        alert('Failed to update the job notice.');
      }
    } catch (error) {
      console.error('Error updating job notice:', error);
      alert('Failed to update the job notice.');
    }
  };

  // Open modal for viewing job notice details
  const handleOpenModal = (id) => {
    fetchNoticeDetails(id);
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotice(null);
    setFeedback('');
    setStatus('');
  };

  // Accept the job notice
  const handleAccept = () => setStatus('Accepted');

  // Reject the job notice
  const handleReject = () => setStatus('Rejected');

  // Fetch all job notices on component mount
  useEffect(() => {
    fetchJobNotices();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" textAlign="center">
        View Job Notice Requests
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Job Notice ID</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Publish Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobNotices.map((notice) => (
                <TableRow key={notice.jobNoticeId}>
                  <TableCell>{notice.jobNoticeId}</TableCell>
                  <TableCell>{notice.jobTitle}</TableCell>
                  <TableCell>{notice.publishDate}</TableCell>
                  <TableCell>{notice.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenModal(notice.jobNoticeId)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Job Notice Details</DialogTitle>
        <DialogContent>
          {dialogLoading ? (
            <CircularProgress />
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6">Job Title: {selectedNotice?.jobTitle}</Typography>
                <Typography>Description: {selectedNotice?.description}</Typography>
                <Typography>Status: {status || selectedNotice?.status}</Typography>
                <TextField
                  label="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAccept} color="success">
            Accept
          </Button>
          <Button onClick={handleReject} color="error">
            Reject
          </Button>
          <Button onClick={updateJobNotice}>Submit Feedback</Button>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
