
// // export default StateTable;
// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchStates, addState, updateState, deleteState } from "../../../redux/slices/Countrystate/stateSlice";
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
//   Grid,
// } from "@mui/material";
// import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";

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

// const StateTable = ({ countries = [] }) => {
//   const [selectedCountryId, setSelectedCountryId] = useState(null); // Track selected country
//   const [newState, setNewState] = useState("");
//   const [open, setOpen] = useState(false);
//   const [currentState, setCurrentState] = useState(null);

//   const dispatch = useDispatch();
//   const states = useSelector((state) => state.states.states || []); // Ensure we get the list of states

//   // Fetch all states when the component mounts
//   useEffect(() => {
//     dispatch(fetchStates());
//   }, [dispatch]);

//   // Filter states based on selected country
//   const filteredStates = selectedCountryId
//     ? states.filter((state) => state.countryId === selectedCountryId)
//     : states;

//   // const handleAddState = () => {
//   //   if (newState.trim() && selectedCountryId) {
//   //     dispatch(addState({ state: newState.trim(), countryId: selectedCountryId }));
//   //     setNewState("");
//   //   }
//   // };

//   const handleAddState = () => {
//     if (newState.trim() && selectedCountryId) {
//       dispatch(addState({ state: newState.trim(), countryId: selectedCountryId }))
//       .then(()=>{
//         dispatch(fetchStates());
//       });
//       setNewState("");
//     }
//   };

//   const handleDeleteState = (stateId) => {
//     dispatch(deleteState(stateId));
//   };

//   const handleUpdateState = (stateId, updatedState) => {
//     dispatch(updateState({ stateId, state: updatedState }));
//     setOpen(false);
//     setCurrentState(null);
//   };

//   const handleEdit = (state) => {
//     setCurrentState(state);
//     setOpen(true);
//   };

//   return (
//     <div className="state" style={{ padding: "20px" }}>
//       <h2>States</h2>

//       {/* Dropdown to select country */}
//       <FormControl variant="outlined" style={{ marginBottom: "20px", width: "200px" }}>
//         <InputLabel>Country</InputLabel>
//         <Select
//           value={selectedCountryId || ""}
//           onChange={(e) => setSelectedCountryId(e.target.value)}
//           label="Country"
//         >
//           <MenuItem value="">
//             <em>All Countries</em>
//           </MenuItem>
//           {countries.map((country) => (
//             <MenuItem key={country.countryId} value={country.countryId}>
//               {country.country}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       {/* Add New State */}
//       <div style={{ marginBottom: "20px" }}>
//         <TextField
//           label="New State Name"
//           value={newState}
//           onChange={(e) => setNewState(e.target.value)}
//           variant="outlined"
//           size="small"
//           style={{ marginRight: "10px" }}
//         />
//         <Button variant="contained" color="primary" onClick={handleAddState}>
//           Add State
//         </Button>
//       </div>

//       {/* Table to Display States */}
//       {/* <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>State</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredStates.map((state) => (
//               <TableRow key={state.stateId}>
//                 <TableCell>{state.state}</TableCell>
//                 <TableCell align="right">
//                   <Tooltip title="Edit">
//                     <IconButton color="primary" onClick={() => handleEdit(state)}>
//                       <EditIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Delete">
//                     <IconButton color="error" onClick={() => handleDeleteState(state.stateId)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer> */}

//       <Grid container spacing={2} alignItems="flex-start">
    
//     <Grid item xs={12} md={6}>
//       <TableContainer component={Paper} sx={{ maxHeight: 500, maxWidth: 450, boxShadow: 3, borderRadius: 2, overflow: 'auto' }}>
//         <Table sx={{ maxWidth: 450 }} aria-label="job roles">
//           <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>State</TableCell>
//               <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {[...filteredStates].reverse().map((state) => (
//               <TableRow key={state.stateId}>
//                 <TableCell>{state.state}</TableCell>
//                 <TableCell>
//                   <Tooltip title="Edit">
//                     <IconButton color="primary" onClick={() => handleEdit(state)}>
//                       <EditIcon />
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Delete">
//                     <IconButton color="error" onClick={() => handleDeleteState(state.stateId)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Grid>
// </Grid>

//       {/* Edit Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={style}>
//           <h2>Edit State</h2>
//           <TextField
//             label="State Name"
//             value={currentState?.state || ""}
//             onChange={(e) => setCurrentState({ ...currentState, state: e.target.value })}
//             fullWidth
//           />
//           <Box mt={2}>
//             <Button variant="contained" color="primary" onClick={() => handleUpdateState(currentState.stateId, currentState.state)}>
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default StateTable;


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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TablePagination,
  FormControl,
  Select,
  MenuItem,
  InputLabel
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStates,
  addState,
  updateState,
  deleteState,
} from "../../../redux/slices/Countrystate/stateSlice";
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

export default function StateTable({ countries = [] }) {
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [newState, setNewState] = useState("");
  const [open, setOpen] = useState(false);
  const [currentState, setCurrentState] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);

  const dispatch = useDispatch();
  const states = useSelector((state) => state.states.states || []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  useEffect(() => {
    if (selectedCountryId) {
      dispatch(fetchStates())
        .then((response) => {
          const filteredStates = response.payload.filter(
            (state) => state.countryId === selectedCountryId
          );
          setFilteredStates(filteredStates);
        })
        .catch((err) => {
          setError("Failed to fetch states");
        });
    } else {
      setFilteredStates([]);
    }
  }, [selectedCountryId, dispatch]);

  useEffect(() => {
    const india = countries.find(country => country.country.toLowerCase() === 'india');
    if (india && !selectedCountryId) {
      setSelectedCountryId(india.countryId);
    }
  }, [countries, selectedCountryId]);

  const handleAddState = () => {
    if (newState.trim() && selectedCountryId) {
      dispatch(addState({ state: newState.trim(), countryId: selectedCountryId }))
        .then((response) => {
          setSuccessMessage("State added successfully!");
          setNewState("");
          // Fetch updated states immediately
          return dispatch(fetchStates());
        })
        .then((response) => {
          const updatedStates = response.payload.filter(
            (state) => state.countryId === selectedCountryId
          );
          setFilteredStates(updatedStates);
        })
        .catch((err) => {
          setError("Failed to add state");
        });
    }
  };

  const handleEdit = (state) => {
    setCurrentState(state);
    setOpen(true);
  };

  const handleDeleteClick = (state) => {
    setStateToDelete(state);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (stateToDelete) {
      dispatch(deleteState(stateToDelete.stateId))
        .then(() => {
          setSuccessMessage("State deleted successfully!");
          // Fetch updated states immediately
          return dispatch(fetchStates());
        })
        .then((response) => {
          const updatedStates = response.payload.filter(
            (state) => state.countryId === selectedCountryId
          );
          setFilteredStates(updatedStates);
          setDeleteDialogOpen(false);
          setStateToDelete(null);
        })
        .catch((err) => {
          setError("Failed to delete state");
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setStateToDelete(null);
  };

  const handleSave = () => {
    dispatch(updateState(currentState))
      .then(() => {
        setSuccessMessage("State updated successfully!");
        // Fetch updated states immediately
        return dispatch(fetchStates());
      })
      .then((response) => {
        const updatedStates = response.payload.filter(
          (state) => state.countryId === selectedCountryId
        );
        setFilteredStates(updatedStates);
        setOpen(false);
        setCurrentState(null);
      })
      .catch((err) => {
        setError("Failed to update state");
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination
  const paginatedStates = filteredStates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      p: 3, 
      borderRadius: 2, 
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        States
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            select
            size="small"
            value={selectedCountryId || ''}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            fullWidth
            label="Select Country"
            sx={{
              bgcolor: 'white',
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
            {countries.map((country) => (
              <MenuItem key={country.countryId} value={country.countryId}>
                {country.country}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {selectedCountryId && (
        <>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="New State Name"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  bgcolor: 'white',
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
                onClick={handleAddState}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'black',
                  color: 'white',
                  '&:hover': {
                    bgcolor: alpha('#000', 0.8),
                  },
                  minWidth: 'fit-content',
                  height: 40,
                  whiteSpace: 'nowrap',
                }}
              >
                ADD STATE
              </Button>
            </Box>
          </Box>

          <TableContainer 
            sx={{ 
              boxShadow: 'none',
              border: '1px solid',
              borderColor: alpha('#000', 0.1),
              borderRadius: 1,
              maxHeight: 400,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: 'black' }}>State Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: 'black' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...paginatedStates].reverse().map((state) => (
                  <TableRow 
                    key={state.stateId}
                    sx={{ 
                      '&:hover': { 
                        bgcolor: alpha('#000', 0.02),
                      },
                    }}
                  >
                    <TableCell>{state.state}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small"
                        onClick={() => handleEdit(state)}
                        sx={{ color: 'black' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteClick(state)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <TablePagination
              component="div"
              count={filteredStates.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                '.MuiTablePagination-select': {
                  borderRadius: 1,
                },
              }}
            />
          </Box>
        </>
      )}

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
        <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this state? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Modal 
        open={open} 
        onClose={() => setOpen(false)}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Edit State
            </Typography>
            <TextField
              label="State Name"
              value={currentState?.state || ''}
              onChange={(e) => setCurrentState({ ...currentState, state: e.target.value })}
              fullWidth
              size="small"
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleSave}
                sx={{
                  bgcolor: 'black',
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
