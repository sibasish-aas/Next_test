'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInterviewRoundData } from '@/redux/slices/InterviewSlice/InterviewSlice'; // Import the thunk action
import { CircularProgress, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Importing CloseIcon
import ScheduleForm from './SchdeduleForm'; // Import the ScheduleForm component

const InterviewResult = ({Application}) => {
  const dispatch = useDispatch();

  // State to manage the modal form for scheduling/rescheduling
  const [openModal, setOpenModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
const [scheduleApplicant,SetScheduleApplicant]=useState();
 
  // Access status and interview round data from the Redux store
  const interviewData = useSelector(state => state.interview.interviewRoundData);
  const status = useSelector(state => state.interview.status);
  const error = useSelector(state => state.interview.error);
  useEffect(() => {
    // Dispatch the action to fetch interview round data when the component mounts
    // const applicantDetails = { 
    //     applicantId: Application.applicantId,
    //     fullName: Application.fullName,
    //     role: Application.role,
    //     candidateEmail: Application.email
    //   };
    //   console.log("dynamic data",applicantDetails)

    const applicantDetails = { 
        applicantId: 220,
        fullName: "Tanmaya Kumar Parida",
        role: "hr",
        candidateEmail: "it_pujarini@outlook.com"
      };

      SetScheduleApplicant(applicantDetails);
      // console.log("ApplicantDetails is in interview result props 2",applicantDetails)
    dispatch(fetchInterviewRoundData( {applicantDetails} ));
  },[dispatch]);


  //to be deleted
  useEffect(() => {
    // Log the interview round data or error to the console when the status is updated
    if (status === 'succeeded') {
      console.log('Interview Round Data for id 220:', interviewData);
    } else if (status === 'failed') {
      console.log('Error fetching interview round data:', error);
    }
  }, [status, interviewData, error]);

  // Function to format date to dd-mm-yyyy format
  const formatDate = (dateString) => {
    if (!dateString) return 'NA';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Function to render rounds in row format
  const renderRounds = (rounds) => {
    if (!rounds) return <Typography variant="body2" color="error">No rounds available</Typography>;

    return Object.keys(rounds).map((roundKey) => {
      const round = rounds[roundKey];
      return (
        <TableRow key={roundKey}>
          <TableCell>{roundKey || '_'}</TableCell>
          <TableCell>{round.feedback || 'NA'}</TableCell>
          <TableCell>{formatDate(round.interviewDate) || 'NA'}</TableCell>
          <TableCell>{round.interviewTime || 'NA'}</TableCell>
          <TableCell>{round.interviewMode || 'NA'}</TableCell>
          <TableCell>{round.interviewerName || 'NA'}</TableCell>
          <TableCell>{round.cleared || 'NA'}</TableCell>
          <TableCell>
            {round.cleared && round.cleared !== 'NA' ? (
              <Button variant="outlined" color="primary" disabled sx={{ width: '150px' }}>
                Completed
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                sx={{ width: '150px' }}
                onClick={() => handleActionButtonClick(round, roundKey)}
              >
                Reschedule
              </Button>
            )}
          </TableCell>
        </TableRow>
      );
    });
  };

  // Handle the action button click (to open modal)
  const handleActionButtonClick = (round, roundKey) => {
    setSelectedRound({ ...round, roundKey }); // Pass the round data and round name
    setOpenModal(true); // Open the modal
  };

  // Handle modal form cancel
  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedRound(null);
  };

  // Handle form submission (after rescheduling)
  const handleFormSubmit = (formData) => {
    console.log('Interview scheduled/rescheduled:', formData);
    setOpenModal(false); // Close the modal after submission
  };

  return (
    <div>
      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      )}
      {status === 'failed' && <Typography variant="body2" color="error">Error: {error}</Typography>}
      {status === 'succeeded' && interviewData && interviewData.interviewDetails && (
        <Paper sx={{ marginTop: '20px', padding: '16px' }}>
          <TableContainer sx={{ marginTop: '20px', overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Round Name</strong></TableCell>
                  <TableCell><strong>Feedback</strong></TableCell>
                  <TableCell><strong>Interview Date</strong></TableCell>
                  <TableCell><strong>Interview Time</strong></TableCell>
                  <TableCell><strong>Interview Mode</strong></TableCell>
                  <TableCell><strong>Interviewer Name</strong></TableCell>
                  <TableCell><strong>Result</strong></TableCell>
                  <TableCell><strong>Action</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderRounds(interviewData.interviewDetails.rounds)}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Modal for rescheduling or other actions */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: 3,
          boxShadow: 24,
          width: '90%',
          maxWidth: 600,
        }}>
          {/* Close Button Icon */}
          <IconButton
            onClick={handleModalClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

         

          {/* ScheduleForm component inside Modal */}
          {selectedRound && (
            <ScheduleForm
              application={scheduleApplicant}
              roundName={selectedRound.roundKey}
              existingInterviewData={selectedRound}
              interviewers={['raghubar das', 'sanya mehra']} // Pass the list of interviewers
              onSubmit={handleFormSubmit}
              onCancel={handleModalClose}
            />
          )}

        </Box>
      </Modal>
    </div>
  );
};

export default InterviewResult;
