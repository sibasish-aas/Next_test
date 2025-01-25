
// // InterviewRoundTable.js
// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchInterviewRounds, addInterviewRound, updateInterviewRound, deleteInterviewRound } from "../../../redux/slices/Jobrole_interview/interviewSlice";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Button,
//   Tooltip,
//   Modal,
//   Box,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
// } from "@mui/material";
// import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 300,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
// };

// const InterviewRoundTable = ({ jobRoles = []}) => {
//   const [selectedJobRoleId, setSelectedJobRoleId] = useState(null);
//   const [newInterviewRound, setNewInterviewRound] = useState("");
//   const [open, setOpen] = useState(false);
//   const [currentInterviewRound, setCurrentInterviewRound] = useState(null);

//   const dispatch = useDispatch();
//   const interviewRounds = useSelector((state) => state.interviewRounds.interviewRounds || []);

//   useEffect(() => {
//     dispatch(fetchInterviewRounds());
//   }, [dispatch]);

//   const filteredInterviewRounds = selectedJobRoleId
//     ? interviewRounds.filter((round) => round.jobRoleId === selectedJobRoleId)
//     : interviewRounds;

//   // const handleAddInterviewRound = () => {
//   //   if (newInterviewRound.trim() && selectedJobRoleId) {
//   //     dispatch(addInterviewRound({ roundName: newInterviewRound.trim(), jobRoleId: selectedJobRoleId }));
//   //     setNewInterviewRound("");
//   //   }
//   // };

//   const handleAddInterviewRound = () => {
//     if (newInterviewRound.trim() && selectedJobRoleId) {
//       dispatch(addInterviewRound({ roundName: newInterviewRound.trim(), jobRoleId: selectedJobRoleId }))
//       .then(()=>{
//         dispatch(fetchInterviewRounds());
//       });
//       setNewInterviewRound("");
//     }
//   };

//   const handleDeleteInterviewRound = (roundId) => {
//     dispatch(deleteInterviewRound(roundId));
//   };

//   const handleUpdateInterviewRound = (roundId, updatedRound) => {
//     dispatch(updateInterviewRound({ roundId, roundName: updatedRound }));
//     setOpen(false);
//     setCurrentInterviewRound(null);
//   };

//   const handleEdit = (round) => {
//     setCurrentInterviewRound(round);
//     setOpen(true);
//   };

//   return (
//     <div style={{marginTop:"20px" }}>
//       <h2>Interview Rounds</h2>

//       {/* Dropdown to select job role */}
//       <FormControl variant="outlined" style={{ marginBottom: "20px", width: "200px" }}>
//         <InputLabel>Job Role</InputLabel>
//         <Select
//           value={selectedJobRoleId || ""}
//           onChange={(e) => setSelectedJobRoleId(e.target.value)}
//           label="Job Role"
//         >
//           <MenuItem value="">
//             <em>All Job Roles</em>
//           </MenuItem>
//           {jobRoles.map((jobRole) => (
//             <MenuItem key={jobRole.jobRoleId} value={jobRole.jobRoleId}>
//               {jobRole.jobRole}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Add New Interview Round */}
//       <div style={{ marginBottom: "20px" }}>
//         <TextField
//           label="New Interview Round Name"
//           value={newInterviewRound}
//           onChange={(e) => setNewInterviewRound(e.target.value)}
//           variant="outlined"
//           size="small"
//           style={{ marginRight: "20px" }}
//         />
//         <Button variant="contained" color="primary" onClick={handleAddInterviewRound}>
//           Add Round
//         </Button>
//       </div>

     

//       <TableContainer component={Paper} sx={{ maxHeight: 400,maxWidth:420, boxShadow: 3, borderRadius: 2, overflow: 'auto' }}>
//   <Table sx={{ maxWidth: 420 }} aria-label="interview rounds">
//     <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//       <TableRow>
//         <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Interview Round</TableCell>
//         <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Actions</TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {[...filteredInterviewRounds].reverse().map((round) => (
//         <TableRow key={round.roundId} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
//           <TableCell>{round.roundName}</TableCell>
//           <TableCell>
//             <Tooltip title="Edit">
//               <IconButton color="primary" onClick={() => handleEdit(round)}>
//                 <EditIcon />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Delete">
//               <IconButton color="error" onClick={() => handleDeleteInterviewRound(round.roundId)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Tooltip>
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

//       {/* Edit Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={style}>
//           <h2>Edit Interview Round</h2>
//           <TextField
//             label="Interview Round Name"
//             value={currentInterviewRound?.roundName || ""} 
//             onChange={(e) => setCurrentInterviewRound({ ...currentInterviewRound, roundName: e.target.value })} // Updated to roundName
//             fullWidth
//           />
//           <Box mt={2}>
//             <Button variant="contained" color="primary" onClick={() => handleUpdateInterviewRound(currentInterviewRound.roundId, currentInterviewRound.roundName)}>
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default InterviewRoundTable;



// InterviewRoundTable.js
"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Modal,
  Paper,
  alpha,
  Fade,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInterviewRounds,
  addInterviewRound,
  updateInterviewRound,
  deleteInterviewRound,
  clearMessages
} from "../../../redux/slices/Jobrole_interview/interviewSlice";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  borderRadius: 2,
  p: 4,
};

export default function InterviewRoundTable({ jobRoles = [], selectedJobRoleId, setSelectedJobRoleId }) {
  const [newRoundName, setNewRoundName] = useState("");
  const [open, setOpen] = useState(false);
  const [currentRound, setCurrentRound] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roundToDelete, setRoundToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const interviewRounds = useSelector((state) => state.interviewRounds.interviewRounds || []);
  const error = useSelector((state) => state.interviewRounds.error);

  useEffect(() => {
    dispatch(fetchInterviewRounds());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleAddRound = () => {
    if (newRoundName.trim() && selectedJobRoleId) {
      dispatch(addInterviewRound({ roundName: newRoundName.trim(), jobRoleId: selectedJobRoleId }))
        .then(() => {
          dispatch(fetchInterviewRounds());
          setSuccessMessage("Interview round added successfully!");
        });
      setNewRoundName("");
    }
  };

  const handleEdit = (round) => {
    setCurrentRound(round);
    setOpen(true);
  };

  const handleDeleteClick = (round) => {
    setRoundToDelete(round);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roundToDelete) {
      dispatch(deleteInterviewRound(roundToDelete.roundId))
        .then(() => {
          setSuccessMessage("Interview round deleted successfully!");
          dispatch(fetchInterviewRounds());
        });
      setDeleteDialogOpen(false);
      setRoundToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoundToDelete(null);
  };

  const handleSave = () => {
    dispatch(updateInterviewRound(currentRound))
      .then(() => {
        setSuccessMessage("Interview round updated successfully!");
        dispatch(fetchInterviewRounds());
      });
    setOpen(false);
    setCurrentRound(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredInterviewRounds = selectedJobRoleId
    ? interviewRounds.filter((round) => round.jobRoleId === selectedJobRoleId)
    : interviewRounds;

  const selectedJobRole = jobRoles.find((role) => role.jobRoleId === selectedJobRoleId);

  // Pagination
  const paginatedRounds = filteredInterviewRounds.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Success and Error Messages */}
      <Snackbar 
        open={!!successMessage || !!error} 
        autoHideDuration={3000} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={successMessage ? "success" : "error"} 
          sx={{ 
            width: '100%',
            bgcolor: successMessage ? alpha('#4caf50', 0.9) : alpha('#f44336', 0.9),
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, color: 'black', fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the interview round "{roundToDelete?.roundName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              color: 'black',
              '&:hover': {
                bgcolor: alpha('#000', 0.05),
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#d32f2f',
              color: 'white',
              '&:hover': {
                bgcolor: alpha('#d32f2f', 0.9),
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h6" sx={{ mb: 3, color: 'black', fontWeight: 500 }}>
        Interview Rounds {selectedJobRole ? `for ${selectedJobRole.jobRole}` : ''}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        {/* Dropdown to select job role */}
        <FormControl 
          variant="outlined" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
        >
          <InputLabel>Select Job Role</InputLabel>
          <Select
            value={selectedJobRoleId || ""}
            onChange={(e) => setSelectedJobRoleId(e.target.value)}
            label="Select Job Role"
          >
            <MenuItem value="">
              <em>Select Job Role</em>
            </MenuItem>
            {jobRoles.map((role) => (
              <MenuItem key={role.jobRoleId} value={role.jobRoleId}>
                {role.jobRole}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedJobRoleId && (
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
              label="New Round Name"
              value={newRoundName}
              onChange={(e) => setNewRoundName(e.target.value)}
              variant="outlined"
              size="medium"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleAddRound}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'black',
                color: 'white',
                '&:hover': {
                  bgcolor: alpha('#000', 0.8),
                },
                minWidth: 130,
                height: 56,
                whiteSpace: 'nowrap',
                px: 3,
              }}
            >
              Add Round
            </Button>
          </Box>
        )}
      </Box>

      {selectedJobRoleId ? (
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          <TableContainer 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              borderRadius: 2, 
              overflow: 'hidden',
              border: '1px solid',
              borderColor: alpha('#000', 0.1),
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha('#000', 0.02) }}>
                  <TableCell sx={{ fontWeight: 600, color: 'black', width: '70%' }}>Round Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'black', width: '30%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRounds.map((round) => (
                  <TableRow 
                    key={round.roundId}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: alpha('#000', 0.02),
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell>{round.roundName}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit" arrow>
                          <IconButton 
                            onClick={() => handleEdit(round)}
                            sx={{ 
                              color: 'black',
                              '&:hover': { 
                                bgcolor: alpha('#000', 0.05),
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton 
                            onClick={() => handleDeleteClick(round)}
                            sx={{ 
                              color: '#d32f2f',
                              '&:hover': { 
                                bgcolor: alpha('#d32f2f', 0.05),
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredInterviewRounds.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '.MuiTablePagination-select': {
                borderRadius: 1,
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body1" sx={{ color: alpha('#000', 0.6) }}>
          Please select a job role to manage interview rounds
        </Typography>
      )}

      {/* Edit Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" sx={{ mb: 3, color: 'black', fontWeight: 600 }}>
              Edit Interview Round
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TextField
              label="Round Name"
              value={currentRound?.roundName || ''}
              onChange={(e) => setCurrentRound({ ...currentRound, roundName: e.target.value })}
              fullWidth
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'black',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button 
                onClick={() => setOpen(false)}
                sx={{
                  color: 'black',
                  '&:hover': {
                    bgcolor: alpha('#000', 0.05),
                  },
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleSave}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: alpha('#000', 0.8),
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
