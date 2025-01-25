import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
} from '@mui/material';
import { Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';

// Updated applicant data with interview date, time, and mode
const applicantsData = [
  { applicantId: 1, name: 'John Doe', role: 'Software Engineer', experience: '5 years', feedback: '', result: '', interviewDate: '2025-02-10', interviewTime: '10:00 AM', mode: 'Online' },
  { applicantId: 2, name: 'Jane Smith', role: 'Product Manager', experience: '3 years', feedback: 'Good candidate', result: 'Pass', interviewDate: '2025-02-12', interviewTime: '2:00 PM', mode: 'In-person' },
  { applicantId: 3, name: 'Bob Johnson', role: 'Designer', experience: '4 years', feedback: '', result: '', interviewDate: '2025-02-15', interviewTime: '11:00 AM', mode: 'Online' },
  { applicantId: 4, name: 'Alice Davis', role: 'QA Engineer', experience: '2 years', feedback: '', result: '', interviewDate: '2025-02-17', interviewTime: '9:00 AM', mode: 'In-person' },
  { applicantId: 5, name: 'Eve White', role: 'Frontend Developer', experience: '3 years', feedback: 'Excellent skills', result: 'Fail', interviewDate: '2025-02-20', interviewTime: '3:00 PM', mode: 'Online' },
  { applicantId: 6, name: 'Michael Green', role: 'Backend Developer', experience: '6 years', feedback: '', result: '', interviewDate: '2025-02-22', interviewTime: '4:00 PM', mode: 'In-person' },
  { applicantId: 7, name: 'Lucy Brown', role: 'Product Designer', experience: '4 years', feedback: '', result: '', interviewDate: '2025-02-25', interviewTime: '5:00 PM', mode: 'Online' },
];

const InterviewList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [mode, setMode] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false); // To control if the fields are read-only
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for showing the loader

  // Simulate loading applicants at once (without delay)
  useEffect(() => {
    // Set the loading state to true at the start
    setIsLoading(true);

    // Simulate data loading (we'll directly set the applicants)
    setApplicants(applicantsData);
    setFilteredApplicants(applicantsData);

    // Set loading state to false after the data is loaded
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Filter applicants by name or applicantId based on the search term
    const filtered = applicants.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.applicantId.toString().includes(searchTerm)
    );
    setFilteredApplicants(filtered);
  }, [searchTerm, applicants]);

  const handleOpenModal = (applicant) => {
    setSelectedApplicant(applicant);
    setFeedback(applicant.feedback || ''); // Initialize with existing feedback or empty string
    setStatus(applicant.result || ''); // Initialize with existing result or empty string
    setInterviewDate(applicant.interviewDate || '');
    setInterviewTime(applicant.interviewTime || '');
    setMode(applicant.mode || '');
    setIsReadOnly(applicant.feedback !== '' && applicant.result !== ''); // Make fields read-only if feedback/result is already filled
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedApplicant(null);
    setFeedback('');
    setStatus('');
    setInterviewDate('');
    setInterviewTime('');
    setMode('');
    setIsReadOnly(false); // Reset read-only flag
  };

  const handleReset = () => {
    // Reset feedback, status, and interview info to empty values
    setFeedback('');
    setStatus('');
    setInterviewDate('');
    setInterviewTime('');
    setMode('');
    setIsReadOnly(false); // Remove read-only if reset is triggered
  };
//ok
  const handleSubmit = () => {
    // Update the feedback, result, and interview info in the applicant data
    selectedApplicant.feedback = feedback;
    selectedApplicant.result = status;
    selectedApplicant.interviewDate = interviewDate;
    selectedApplicant.interviewTime = interviewTime;
    selectedApplicant.mode = mode;

    alert(`Feedback: ${feedback}, Status: ${status}, Interview Date: ${interviewDate}, Interview Time: ${interviewTime}, Mode: ${mode}`);
    handleCloseModal(); // Close modal after submit
  };

  const isSubmitDisabled = !feedback || !status || !interviewDate || !interviewTime || !mode || isReadOnly; // Disable if feedback/status is empty or read-only
  const isResetDisabled = feedback !== '' && status !== '' && (status === 'Pass' || status === 'Fail'); // Disable if feedback/result is filled

  const isRadioDisabled = status === 'Pass' || status === 'Fail'; // Disable radio buttons if status is Pass/Fail

  return (
    <div style={{ padding: '20px' }}>
      {/* Search Box */}
      <TextField
        label="Search by Name or Applicant ID"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      {/* Show loading spinner while data is being loaded */}
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Applicant ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Applicant Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Role</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Experience</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Interview Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Interview Time</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Mode</TableCell>
                  <TableCell style={{ fontWeight: 'bold', borderBottom: '2px solid #ccc' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplicants.map((applicant) => (
                  <TableRow key={applicant.applicantId}>
                    <TableCell>{applicant.applicantId}</TableCell>
                    <TableCell>{applicant.name}</TableCell>
                    <TableCell>{applicant.role}</TableCell>
                    <TableCell>{applicant.experience}</TableCell>
                    <TableCell>{applicant.interviewDate}</TableCell>
                    <TableCell>{applicant.interviewTime}</TableCell>
                    <TableCell>{applicant.mode}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(applicant)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {/* Modal for Viewing Applicant Details */}
      {selectedApplicant && (
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            width: '100vw', // Set modal width relative to viewport width
            maxWidth: '100vw', // Ensure it doesn't exceed 100% of screen width
            height: '100vh',
            maxHeight: '100vh', // Ensure modal height doesn't exceed 90% of viewport height
            margin: 0, // Remove any margin
            padding: 0, // Add some padding inside the modal
          }}
        >
          
          <DialogTitle>
            Applicant Details
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              overflow: 'hidden', // Prevent scrollbars from appearing
              height: 'calc(100vh - 64px)', // Subtract the title and button heights from the full screen height
            }}
          >
            <div>
              <p><strong>Name:</strong> {selectedApplicant.name}</p>
              <p><strong>Applicant ID:</strong> {selectedApplicant.applicantId}</p>
              <p><strong>Role:</strong> {selectedApplicant.role}</p>
              <p><strong>Experience:</strong> {selectedApplicant.experience}</p>
              <p><strong>Interview Date:</strong> {selectedApplicant.interviewDate}</p>
              <p><strong>Interview Time:</strong> {selectedApplicant.interviewTime}</p>
              <p><strong>Interview Mode:</strong> {selectedApplicant.mode}</p>
            </div>

            {/* Feedback and Status Input */}
            <FormControl fullWidth margin="normal">
              <TextField
                label="Feedback"
                variant="outlined"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                multiline
                rows={4}
                disabled={isReadOnly} // Disable if read-only
              />
            </FormControl>

            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                row
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isRadioDisabled} // Disable if result is already Pass or Fail
              >
                <FormControlLabel value="Pass" control={<Radio />} label="Pass" />
                <FormControlLabel value="Fail" control={<Radio />} label="Fail" />
              </RadioGroup>
            </FormControl>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleReset} color="primary" disabled={isResetDisabled}>Reset</Button>
            <Button
              onClick={handleSubmit}
              color="primary"
              disabled={isSubmitDisabled} // Disable if feedback/status is empty or read-only
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default InterviewList;