'use client';

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Box, Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent, InputAdornment, CircularProgress, Pagination, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Visibility as VisibilityIcon, CheckCircleOutline as CheckCircleOutlineIcon, CancelOutlined as CancelOutlinedIcon, Search as SearchIcon, FilterList as FilterListIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { fetchLeaveApplications, downloadAttachment, updateLeaveStatus } from "../../redux/slices/LeaveSlice"; // Import the action from the slice
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import LeaveStatusDisplay from '../../components/leave/LeaveStatusDisplay';

const LeaveRequestList = () => {
  const dispatch = useDispatch();
  const { leaveApplications, status, error } = useSelector((state) => state.leave);

  // Pagination states
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10); // Show 10 items per page

  // New state to manage the loading state
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [expanded, setExpanded] = useState('leaveDetails'); // Default to 'leaveDetails' expanded

  // Handle Download Attachment
  const handleDownload = async (leaveRequestId) => {
    dispatch(downloadAttachment(leaveRequestId));
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaveApplications());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (status === 'succeeded') {
      setSortedData(leaveApplications);
      setLoading(false);
    }
  }, [leaveApplications, status]);

  // Handle Search
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const filteredData = sortedData.filter(
    (leaveRequest) =>
      leaveRequest.Employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leaveRequest.Employee._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tableHeaders = [
    { label: 'Emp ID', column: 'Employee.employee_id', type: 'string' },
    { label: 'Name', column: 'Employee.name', type: 'string' },
    { label: 'From Date', column: 'LeaveStartDate', type: 'date' },
    { label: 'From Shift', column: 'LeaveStartSlot', type: 'string' },
    { label: 'To Date', column: 'LeaveEndDate', type: 'date' },
    { label: 'To Shift', column: 'LeaveEndSlot', type: 'string' },
    { label: 'Type', column: 'LeaveType', type: 'string' },
  ];

  // Open Modal
  const handleOpenModal = (leaveRequest) => {
    setSelectedLeaveRequest(leaveRequest);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLeaveRequest(null);
  };


  const handleApproveReject = async (status, leaveRequest) => {
    try {
      await dispatch(updateLeaveStatus({
        EmployeeId: leaveRequest.Employee.employee_id,
        Status: status,
        Leave_Id: leaveRequest.Leave_Id,
      }));
      

      const updatedLeaveRequests = leaveApplications.map((item) =>
        item.Leave_Id === leaveRequest.Leave_Id
          ? { ...item, Status: status }
          : item
      );
      setSortedData(updatedLeaveRequests);
    } catch (error) {
      console.error("Error updating leave status", error);
    }
  };

  // Pagination change handler
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Paginate filtered data
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // If the clicked panel is already expanded, close it, else open the new panel and close the other one
    setExpanded(isExpanded ? panel : expanded === panel ? expanded : false);
  };

  return (
    <div maxWidth="lg">
      {/* Search and Filter Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
        {/* Search Box with Icon */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{ width: '100%', maxWidth: 300 }} // For responsiveness
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {/* Filter Button */}
        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ marginLeft: 2 }}>Filter</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>S.N</strong></TableCell>
              {tableHeaders.map((header) => (
                <TableCell key={header.column}><strong>{header.label}</strong></TableCell>
              ))}
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Show loading indicator if data is still loading */}
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  sx={{
                    width: '100%',
                    height: '100vh', // Take full viewport height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                  }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              // Show filtered data if available
              paginatedData.map((leaveRequest, index) => (
                <TableRow key={leaveRequest.Leave_Id}>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{leaveRequest.Employee.employee_id}</TableCell>
                  <TableCell>{leaveRequest.Employee.name}</TableCell>
                  <TableCell>{leaveRequest.LeaveStartDate}</TableCell>
                  <TableCell>{leaveRequest.FromShift || "NA"}</TableCell>
                  <TableCell>{leaveRequest.LeaveEndDate}</TableCell>
                  <TableCell>{leaveRequest.ToShift || "NA"}</TableCell>
                  <TableCell>{leaveRequest.LeaveType}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton color="primary" onClick={() => handleOpenModal(leaveRequest)}>
                        <VisibilityIcon />
                      </IconButton>
                      <Tooltip title="Approve">
                        <IconButton
                          color="success"
                          onClick={() => handleApproveReject("Approved", leaveRequest)}
                          disabled={["Approved", "Rejected"].includes(leaveRequest.Status)}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          color="error"
                          onClick={() => handleApproveReject("Rejected", leaveRequest)}
                          disabled={["Approved", "Rejected"].includes(leaveRequest.Status)}
                        >
                          <CancelOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // If no filtered data, show the "No Leave Applications Found" message
              <TableRow>
                <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                  No Leave Applications Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination
          count={Math.ceil(filteredData.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          shape="circular"
          color="primary"
        />
      </Box>

      {/* Modal for viewing leave details */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth sx={{ '& .MuiDialogContent-root': { padding: '6px' } }}>
        <DialogActions sx={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: 5 }}>
          <IconButton onClick={handleCloseModal} color="primary" sx={{ position: 'absolute' }}>
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent>
          {selectedLeaveRequest && (
            <Box sx={{
              display: 'flex', flexDirection: 'column', gap: 2, padding: 2, width: '100%',
            }}>
              {/* Accordion for Leave Details */}
              <Accordion expanded={expanded === 'leaveDetails'} onChange={handleAccordionChange('leaveDetails')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="leaveDetails-content" id="leaveDetails-header">
                  <Typography variant="h6">Leave Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
                    <Typography variant="body1"><strong>Leave ID:</strong> {selectedLeaveRequest.Leave_Id}</Typography>
                    <Typography variant="body1"><strong>Employee ID:</strong> {selectedLeaveRequest.Employee.employee_id}</Typography>
                    <Typography variant="body1"><strong>Employee Name:</strong> {selectedLeaveRequest.Employee.name}</Typography>
                    <Typography variant="body1"><strong>Department:</strong> {selectedLeaveRequest.Employee.department.department_name}</Typography>
                    <Typography variant="body1"><strong>Leave Title:</strong> {selectedLeaveRequest.LeaveTitle}</Typography>
                    <Typography variant="body1"><strong>Leave Type:</strong> {selectedLeaveRequest.LeaveType}</Typography>
                    <Typography variant="body1"><strong>Leave Start Date:</strong> {selectedLeaveRequest.LeaveStartDate}</Typography>
                    <Typography variant="body1"><strong>From Slot:</strong> {selectedLeaveRequest.FromShift || "NA"}</Typography>
                    <Typography variant="body1"><strong>Leave End Date:</strong> {selectedLeaveRequest.LeaveEndDate}</Typography>
                    <Typography variant="body1"><strong>To Slot:</strong> {selectedLeaveRequest.ToShift || "NA"}</Typography>
                    <Typography variant="body1"><strong>Description:</strong> {selectedLeaveRequest.Description}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {selectedLeaveRequest.Status}</Typography>
                    <Typography variant="body1"><strong>Attachment:</strong> <br />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload(selectedLeaveRequest.Leave_Id)}
                        sx={{ marginTop: '10px', fontSize: '12px' }}
                        startIcon={<DownloadIcon />}
                      >
                        Attachment
                      </Button>
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Accordion for Leave Status Display */}
              <Accordion expanded={expanded === 'leaveStatus'} onChange={handleAccordionChange('leaveStatus')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="leaveStatus-content" id="leaveStatus-header">
                  <Typography variant="h6">Leave Status</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <LeaveStatusDisplay employeeid={selectedLeaveRequest.Employee.employee_id} />
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestList;
