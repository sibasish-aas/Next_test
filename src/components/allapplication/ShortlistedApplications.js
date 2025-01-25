'use client'



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShortlistedJobApplications } from '../../redux/slices/JobApplicationsSlice/JobApplicationsSlice';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import Pagination from '../common-ui/Pagination'; // Import the Pagination component
import ShortlistedView from '../allapplication/ShortlistedView'; // Import your existing component for the modal

const ShortlistedApplications = () => {
  const dispatch = useDispatch();

  // Access the state for shortlisted applications, loading status, and errors
  const { shortlistedApplications, status, error } = useSelector((state) => state.jobApplication);

  // State for the current page and selected application for the modal
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openModal, setOpenModal] = useState(false); // To control the modal visibility
  const itemsPerPage = 10;

  // Dispatch the action to fetch shortlisted job applications when the component is mounted
  useEffect(() => {
    dispatch(fetchShortlistedJobApplications());
  }, [dispatch]);

  // Function to handle the page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Slice the shortlistedApplications based on currentPage and itemsPerPage
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = shortlistedApplications.slice(indexOfFirstItem, indexOfLastItem);

  // Function to handle the view click and open the modal
  const handleViewClick = (application) => {
    setSelectedApplication(application); // Set the selected application
    setOpenModal(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedApplication(null); // Clear the selected application
    setOpenModal(false); // Close the modal
  };

  // Render the UI based on the loading, success, or error state
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', padding: 2 }}>
        <Typography variant="h6" color="error">
          Error fetching shortlisted applications: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: 'white', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Applicant ID</strong></TableCell>
              <TableCell><strong>Full Name</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentApplications.length > 0 ? (
              currentApplications.map((application) => (
                <TableRow key={application.applicantId}>
                  <TableCell>{application.applicantId}</TableCell>
                  <TableCell>{application.fullName || 'No Name Provided'}</TableCell>
                  <TableCell>{application.gender || 'N/A'}</TableCell>
                  <TableCell>{application.role || 'N/A'}</TableCell>
                  <TableCell>{application.email || 'N/A'}</TableCell>
                  <TableCell>
                    <VisibilityIcon
                      color="primary"
                      cursor="pointer"
                      onClick={() => handleViewClick(application)} // Open modal with the clicked application
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                  No shortlisted applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        totalItems={shortlistedApplications.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {/* Modal for viewing application details */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="md" 
        fullWidth
        sx={{ 
          '& .MuiDialog-paper': { 
            width: '80vw',   // 80% of the viewport width
            height: '80vh',  // 80% of the viewport height
            maxHeight: '80vh', // Prevents exceeding 80% height
            maxWidth: '80vw', // Prevents exceeding 80% width
            margin: 'auto',   // Centers the dialog
          } 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <ShortlistedView application={selectedApplication} /> {/* Pass the application data to your existing component */}    
      </Dialog>
    </Box>
  );
};

export default ShortlistedApplications;
