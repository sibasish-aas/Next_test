
// "use client";
// import React, { useState, useEffect } from "react";
// import { Button, TextField, Modal, Box, Grid } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchJobRoles, addJobRole, updateJobRole, deleteJobRole } from "../../../redux/slices/Jobrole_interview/jobRoleSlice";
// import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
// import { IconButton, Tooltip, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell } from "@mui/material";
// import InterviewRoundTable from "./InterviewRoundTable"; // Import InterviewRoundTable to show interview rounds

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

// export default function JobRoleTable() {
//   const [newJobRole, setNewJobRole] = useState("");
//   const [open, setOpen] = useState(false);
//   const [currentJobRole, setCurrentJobRole] = useState(null);
//   const [selectedJobRoleId, setSelectedJobRoleId] = useState(null); // Track selected job role

//   const dispatch = useDispatch();
//   const jobRoles = useSelector((state) => state.jobRoles.jobRoles || []); // Ensure it's an array

//   useEffect(() => {
//     dispatch(fetchJobRoles());
//   }, [dispatch]);

//   // const handleAddJobRole = () => {
//   //   if (newJobRole.trim()) {
//   //     dispatch(addJobRole(newJobRole.trim()));
//   //     setNewJobRole('');
//   //   }
//   // };

//   const handleAddJobRole = () => {
//     if (newJobRole.trim()) {
//       dispatch(addJobRole(newJobRole.trim()))
//       .then(()=>{
//         dispatch(fetchJobRoles());
//       });
//       setNewJobRole('');
//     }
//   };

//   const handleEdit = (jobRole) => {
//     setCurrentJobRole(jobRole);
//     setOpen(true);
//   };

//   const handleDelete = (jobRoleId) => {
//     dispatch(deleteJobRole(jobRoleId));
//   };

//   const handleSave = () => {
//     dispatch(updateJobRole(currentJobRole));
//     setOpen(false);
//     setCurrentJobRole(null);
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Job Roles</h2>

//       {/* Add New Job Role */}
//       <div style={{ marginBottom: "10px" }}>
//         <TextField
//           label="New Job Role Name"
//           value={newJobRole}
//           onChange={(e) => setNewJobRole(e.target.value)}
//           variant="outlined"
//           size="small"
//           style={{ marginRight: "10px" }}
//         />
//         <Button variant="contained" color="primary" onClick={handleAddJobRole}>
//           Add Job Role
//         </Button>
//       </div>

//       {/* Layout using Grid for side-by-side placement */}
//       <Grid container spacing={2} alignItems="flex-start">
//         {/* Job Role Table */}
//         <Grid item xs={12} md={6}>
//           <TableContainer component={Paper} sx={{ maxHeight: 400, maxWidth: 350, boxShadow: 3, borderRadius: 2, overflow: 'auto' }}>
//             <Table sx={{ maxWidth: 350 }} aria-label="job roles">
//               <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Job Role</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {[...jobRoles].reverse().map((jobRole) => (
//                   <TableRow key={jobRole.jobRoleId}>
//                     <TableCell>{jobRole.jobRole}</TableCell>
//                     <TableCell>
//                       <Tooltip title="Edit">
//                         <IconButton color="primary" onClick={() => handleEdit(jobRole)}>
//                           <EditIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Delete">
//                         <IconButton color="error" onClick={() => handleDelete(jobRole.jobRoleId)}>
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>

//         {/* Interview Round Table (on the right) */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//  /* Add some margin to push it down slightly */
//             display: "flex",
//             justifyContent: "-moz-initial", // Align to the right side
//           }}
//         >
//           <InterviewRoundTable jobRoles={jobRoles} selectedJobRoleId={selectedJobRoleId} setSelectedJobRoleId={setSelectedJobRoleId} />
//         </Grid>
//       </Grid>

//       {/* Edit Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={style}>
//           <h2>Edit Job Role</h2>
//           <TextField
//             label="Job Role Name"
//             value={currentJobRole?.jobRole || ''}
//             onChange={(e) => setCurrentJobRole({ ...currentJobRole, jobRole: e.target.value })}
//             fullWidth
//           />
//           <Box mt={2}>
//             <Button variant="contained" color="primary" onClick={handleSave}>
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Modal, 
  Box, 
  Grid,
  IconButton, 
  Tooltip, 
  TableContainer, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableBody, 
  TableCell,
  Typography,
  alpha,
  Fade,
  Divider,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobRoles, addJobRole, updateJobRole, deleteJobRole, clearMessages } from "../../../redux/slices/Jobrole_interview/jobRoleSlice";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import InterviewRoundTable from "./InterviewRoundTable";

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

export default function JobRoleTable() {
  const [newJobRole, setNewJobRole] = useState("");
  const [open, setOpen] = useState(false);
  const [currentJobRole, setCurrentJobRole] = useState(null);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const dispatch = useDispatch();
  const jobRoles = useSelector((state) => state.jobRoles.jobRoles || []);
  const success = useSelector((state) => state.jobRoles.success);
  const error = useSelector((state) => state.jobRoles.error);
  const [successMessage, setSuccessMessage] = useState("");


  
  useEffect(() => {
    dispatch(fetchJobRoles());
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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  const handleAddJobRole = () => {
    if (newJobRole.trim()) {
      dispatch(addJobRole(newJobRole.trim()))
        .then(() => {
          dispatch(fetchJobRoles());
          setSuccessMessage("Job role added successfully!");
        });
      setNewJobRole('');
    }
  };

  const handleEdit = (jobRole) => {
    setCurrentJobRole(jobRole);
    setOpen(true);
  };

  const handleDeleteClick = (jobRole) => {
    setRoleToDelete(jobRole);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      dispatch(deleteJobRole(roleToDelete.jobRoleId))
        .then(() => {
          setSuccessMessage("Job role deleted successfully!");
        });
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const handleSave = () => {
    dispatch(updateJobRole(currentJobRole))
      .then(() => {
        setSuccessMessage("Job role updated successfully!");
      });
    setOpen(false);
    setCurrentJobRole(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'black', fontWeight: 600 }}>
        Job Roles Management
      </Typography>

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
            Are you sure you want to delete the job role "{roleToDelete?.jobRole}"? This action cannot be undone.
            <br /><br />
            <strong>Warning:</strong> Deleting this job role will also delete all associated interview rounds.
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

      <Grid container spacing={4}>
        {/* Left Column - Job Roles */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: alpha('#000', 0.1),
              height: '100%',
              minWidth: 400,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: 'black', fontWeight: 500 }}>
              Job Roles
            </Typography>

            {/* Add New Job Role */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <TextField
                label="New Job Role"
                value={newJobRole}
                onChange={(e) => setNewJobRole(e.target.value)}
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
                onClick={handleAddJobRole}
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
                Add Role
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, color: 'black', width: '70%' }}>Job Role</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'black', width: '30%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...jobRoles].reverse().map((jobRole) => (
                    <TableRow 
                      key={jobRole.jobRoleId}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha('#000', 0.02),
                        },
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onClick={() => setSelectedJobRoleId(jobRole.jobRoleId)}
                    >
                      <TableCell>{jobRole.jobRole}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit" arrow>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(jobRole);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(jobRole);
                              }}
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
          </Paper>
        </Grid>

        {/* Right Column - Interview Rounds */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%', 
              bgcolor: 'white',
              minHeight: 600
            }}
          >
            <InterviewRoundTable 
              jobRoles={jobRoles} 
              selectedJobRoleId={selectedJobRoleId} 
              setSelectedJobRoleId={setSelectedJobRoleId} 
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" sx={{ mb: 3, color: 'black', fontWeight: 600 }}>
              Edit Job Role
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <TextField
              label="Job Role Name"
              value={currentJobRole?.jobRole || ''}
              onChange={(e) => setCurrentJobRole({ ...currentJobRole, jobRole: e.target.value })}
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
