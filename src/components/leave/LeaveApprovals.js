'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputAdornment, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Grid } from '@mui/material';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { fetchEmployeeLeaveApplications,fetchEmployeeByEmail , downloadAttachment } from '../../redux/slices/LeaveSlice'; // Adjust the path accordingly
import DownloadIcon from '@mui/icons-material/Download';
import NewLeaveRequestForm from './NewLeaveRequestForm'; // Import the NewLeaveRequestForm
import CloseIcon from '@mui/icons-material/Close'; // Close icon for the modal
import LeaveStatusDisplay from '../../components/leave/LeaveStatusDisplay'; // A new component for displaying leave details inside the modal

const LeaveApprovals = () => {
  const dispatch = useDispatch();

  // Accessing the employee's leave applications and loading/error state from the Redux store
  const { employeeLeaveApplications , status, error } = useSelector((state) => state.leave);
  const employeeData = useSelector((state) => state.leave.EmployeeData);
  const employeeId=employeeData.length > 0 ? employeeData[0].employee_id : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [applyLeaveModalOpen, setApplyLeaveModalOpen] = useState(false);
  const [openItemModal, setOpenItemModal] = useState(false); // Modal for Viewing Leave Item Details
  const [openLeaveByIdModal, setOpenLeaveByIdModal] = useState(false); // Modal for Viewing Leave by ID
  const [selectedLeaveData, setSelectedLeaveData] = useState(null); // State to store the selected leave data

  // New state for managing the loader visibility within the TableBody
  const [loading, setLoading] = useState(true);  // Start with loader visible

  //this use effect for get employeedetails
  useEffect(() => {
    dispatch(fetchEmployeeByEmail()); // Dispatch the thunk to fetch employee data
  }, [dispatch]);
  

  const handleDownload = async (leaveRequestId) => {
    // Dispatch the downloadAttachment action with the leave request ID
    dispatch(downloadAttachment(leaveRequestId));
  };

  // Dispatch action to fetch leave applications for the given employeeId when component mounts
  useEffect(() => {
    if (employeeId) {
      dispatch(fetchEmployeeLeaveApplications(employeeId));  // Ensure to call the correct action from the slice
    }
  }, [dispatch, employeeId]);

  // Simulate loading delay (1 second) and then show data
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);  // Hide loader after 1 second
    }, 2000);  // 2 second delay
    return () => clearTimeout(timeout);  // Clean up timeout if the component unmounts
  }, [employeeLeaveApplications]);

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  
  

  // Filtered leave data based on search query
  const filteredLeaveData = employeeLeaveApplications.filter(
    (leaveRequest) => {
      console.log(leaveRequest);
      const leaveIdMatches = leaveRequest.Leave_Id.toString().includes(searchQuery);
      const startDateMatches = leaveRequest.LeaveStartDate.toLowerCase().includes(searchQuery.toLowerCase());
      const titleMatches = leaveRequest.LeaveTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatches = leaveRequest.Status.toLowerCase().includes(searchQuery.toLowerCase());
      
      return leaveIdMatches || startDateMatches || titleMatches || statusMatches;
    }
  );


  //const filteredLeaveData = employeeLeaveApplications;


  // Open modal for viewing leave item details and set selected leave data
  const handleOpenItemModal = (leaveData) => {
    setSelectedLeaveData(leaveData); // Set the selected leave data
    setOpenItemModal(true);  // Open the modal
  };

  // Close the leave item modal
  const handleCloseItemModal = () => {
    setOpenItemModal(false);  // Close the modal
    setSelectedLeaveData(null); // Clear selected leave data when closing modal
  };

  // Open Apply Leave modal
  const handleOpenApplyLeave = () => {
    setApplyLeaveModalOpen(true);
  };

  // Close Apply Leave modal
  const handleCloseApplyLeave = () => {
    setApplyLeaveModalOpen(false);
  };

  // Open Leave by ID modal
  const handleOpenLeaveById = () => {
    setOpenLeaveByIdModal(true);
  };

  // Close Leave by ID modal
  const handleCloseLeaveById = () => {
    setOpenLeaveByIdModal(false);
  };

  return (
    <div>
      {/* Header with Search Bar and Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 3, gap: 2 }}>
        {/* Search Bar */}
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <TextField
            label="Search by Leave ID"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Apply Leave Button */}
        <Button variant="contained" color="primary" onClick={handleOpenApplyLeave}>
          Apply
        </Button>

        {/* View Leave by ID Button */}
        <Button variant="contained" color="primary" onClick={handleOpenLeaveById}>
          Available
        </Button>
      </Box>

      {/* Table displaying leave data */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Leave ID</strong></TableCell>
              <TableCell><strong>From Date</strong></TableCell>
              <TableCell><strong>From Shift</strong></TableCell>
              <TableCell><strong>To Date</strong></TableCell>
              <TableCell><strong>To Shift</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Show Loader for 1 second */}
            {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    sx={{
                      width: '100%',
                      height: '100vh', // Take full viewport height
                      display: 'flex',
                      justifyContent: 'center',  // Horizontally center the loader
                      alignItems: 'center',      // Vertically center the loader
                      position: 'absolute',      // Ensure it covers the entire screen area
                      top: 0,                    // Align it at the top of the page
                      left: 0,                   // Align it at the left of the page
                      zIndex: 9999,              // Ensure it's on top of other content
                    }}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
            ) : filteredLeaveData.length > 0 ? (
              // Show filtered data once loader finishes
              filteredLeaveData.map((leaveRequest) => (
                <TableRow key={leaveRequest.Leave_Id}>
                  <TableCell>{leaveRequest.Leave_Id}</TableCell>
                  <TableCell>{leaveRequest.LeaveStartDate}</TableCell>
                  <TableCell>{leaveRequest.FromShift}</TableCell>
                  <TableCell>{leaveRequest.LeaveEndDate}</TableCell>
                  <TableCell>{leaveRequest.ToShift}</TableCell>
                  <TableCell>{leaveRequest.LeaveType}</TableCell>
                  <TableCell>{leaveRequest.Status}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenItemModal(leaveRequest)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // If no filtered data, show No Leave Found message
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                  No Leave Applications Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Apply Leave Modal */}
      <Dialog open={applyLeaveModalOpen} onClose={handleCloseApplyLeave} sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: 700, height: 'auto', borderRadius: 3, margin: 'auto' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleCloseApplyLeave} edge="end" color="inherit">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <NewLeaveRequestForm employeeId={employeeId} onClose={handleCloseApplyLeave}/>
        </DialogContent>
      </Dialog>

      {/* Modal for Viewing Leave Item Details */}
      <Dialog open={openItemModal} onClose={handleCloseItemModal} sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: 700, height: 'auto', borderRadius: 3, margin: 'auto' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleCloseItemModal} edge="end" color="inherit" sx={{ position: 'absolute' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedLeaveData && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <p><strong>Leave ID:</strong> {selectedLeaveData.Leave_Id}</p>
                <p><strong>From Date:</strong> {selectedLeaveData.LeaveStartDate}</p>
                <p><strong>From Shift:</strong> {selectedLeaveData.FromShift}</p>
                <p><strong>To Date:</strong> {selectedLeaveData.LeaveEndDate}</p>
                <p><strong>To Shift:</strong> {selectedLeaveData.ToShift}</p>
                <p><strong>Status:</strong> {selectedLeaveData.Status}</p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleDownload(selectedLeaveData.Leave_Id)}
                  sx={{ marginTop: '10px', fontSize: '12px' }}
                  startIcon={<DownloadIcon />}
                >
                  Attachment
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <p><strong>Leave Title:</strong> {selectedLeaveData.LeaveTitle}</p>
                <p><strong>Leave Type:</strong> {selectedLeaveData.LeaveType}</p>
                <p><strong>Description:</strong><br/> {selectedLeaveData.Description.length > 100
            ? selectedLeaveData.Description.substring(0, 100) + '...'
            : selectedLeaveData.Description}</p>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal for Viewing Leave by ID */}
      <Dialog open={openLeaveByIdModal} onClose={handleCloseLeaveById} sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: 700, height: 'auto', borderRadius: 3, margin: 'auto' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={handleCloseLeaveById} edge="end" color="inherit">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <LeaveStatusDisplay employeeid={employeeId}/>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveApprovals;
