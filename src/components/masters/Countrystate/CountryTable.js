// "use client";
// import React, { useState, useEffect } from "react";
// import { Button, TextField, Modal, Box } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCountries, addCountry, updateCountry, deleteCountry } from "../../../redux/slices/Countrystate/countrySlice";
// import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
// import { IconButton, Tooltip, TableContainer, Paper, Table, TableHead,
//   TableRow, TableBody, TableCell, Grid } from "@mui/material";
// import StateTable from "./StateTable"; // Import the StateTable component

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

// export default function CountryTable() {
//   const [newCountry, setNewCountry] = useState("");
//   const [open, setOpen] = useState(false);
//   const [currentCountry, setCurrentCountry] = useState(null);

//   const dispatch = useDispatch();
//   const countries = useSelector((state) => state.countries.countries || []); // Ensure it's an array

//   // Fetch countries when the component mounts
//   useEffect(() => {
//     dispatch(fetchCountries());
//   }, [dispatch]);

//   // const handleAddCountry = () => {
//   //   if (newCountry.trim()) {
//   //     dispatch(addCountry(newCountry.trim()));
//   //     setNewCountry('');
//   //   }
//   // };

//   const handleAddCountry = () => {
//   if (newCountry.trim()) {
//     dispatch(addCountry(newCountry.trim()))
//       .then(() => {
//         // Optionally trigger a re-fetch of the countries if needed
//         dispatch(fetchCountries());
//       });
//     setNewCountry(''); // Clear the input field
//   }
// };


//   const handleEdit = (country) => {
//     setCurrentCountry(country);
//     setOpen(true);
//   };

//   const handleDelete = (countryId) => {
//     dispatch(deleteCountry(countryId)); // Use countryId here
//   };

//   const handleSave = () => {
//     dispatch(updateCountry(currentCountry)); // Use currentCountry here
//     setOpen(false);
//     setCurrentCountry(null);
//   };

//   if (!countries) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Countries</h2>

//       {/* Add New Country */}
//       <div style={{ marginBottom: "20px" }}>
//         <TextField
//           label="New Country Name"
//           value={newCountry}
//           onChange={(e) => setNewCountry(e.target.value)}
//           variant="outlined"
//           size="small"
//           style={{ marginRight: "10px" }}
//         />
//         <Button variant="contained" color="primary" onClick={handleAddCountry}>
//           Add Country
//         </Button>
//       </div>

//       {/* Grid layout to separate country and state tables */}
//       <Grid container spacing={2} alignItems="flex-start">
//         <Grid item xs={12} md={6}>
//           {/* Country Table */}
//           <TableContainer component={Paper} sx={{ maxHeight: 500, maxWidth: 450, boxShadow: 3, borderRadius: 2, overflow: 'auto' }}>
//             <Table sx={{ maxWidth: 450 }} aria-label="job roles">
//               <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Country</TableCell>
//                   <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//               {[...countries].reverse().map((country) => (
//                 <TableRow key={country.countryId}> 
//                   <TableCell>{country.country}</TableCell>
//                   <TableCell>
//                     <Tooltip title="Edit">
//                       <IconButton color="primary" onClick={() => handleEdit(country)}>
//                         <EditIcon />
//                       </IconButton>
//                     </Tooltip>
//                     <Tooltip title="Delete">
//                       <IconButton color="error" onClick={() => handleDelete(country.countryId)}>
//                         <DeleteIcon />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           {/* State Table */}
//           <StateTable countries={countries} />
//         </Grid>
//       </Grid>

//       {/* Edit Modal */}
//       <Modal open={open} onClose={() => setOpen(false)}>
//         <Box sx={style}>
//           <h2>Edit Country</h2>
//           <TextField
//             label="Country Name"
//             value={currentCountry?.country || ''}
//             onChange={(e) => setCurrentCountry({ ...currentCountry, country: e.target.value })}
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
  Grid
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCountries,
  addCountry,
  updateCountry,
  deleteCountry,
  clearMessages,
} from "../../../redux/slices/Countrystate/countrySlice";
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import StateTable from './StateTable';

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

export default function CountryTable() {
  const [newCountry, setNewCountry] = useState("");
  const [open, setOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  const dispatch = useDispatch();
  const countries = useSelector((state) => state.countries.countries || []);
  const error = useSelector((state) => state.countries.error);

  useEffect(() => {
    dispatch(fetchCountries()).then(() => {
      console.log(countries);
    });
  }, [dispatch, countries]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const handleAddCountry = () => {
    if (newCountry.trim()) {
      dispatch(addCountry(newCountry.trim()))
        .then(() => {
          dispatch(fetchCountries());
          setSuccessMessage("Country added successfully!");
        });
      setNewCountry("");
    }
  };

  const handleEdit = (country) => {
    setCurrentCountry(country);
    setOpen(true);
  };

  const handleDeleteClick = (country) => {
    setCountryToDelete(country);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (countryToDelete) {
      dispatch(deleteCountry(countryToDelete.countryId))
        .then(() => {
          setSuccessMessage("Country deleted successfully!");
          dispatch(fetchCountries());
          setSelectedCountryId(null); // Reset selected country after delete
        });
      setDeleteDialogOpen(false);
      setCountryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCountryToDelete(null);
  };

  const handleSave = () => {
    dispatch(updateCountry(currentCountry))
      .then(() => {
        setSuccessMessage("Country updated successfully!");
        dispatch(fetchCountries());
      });
    setOpen(false);
    setCurrentCountry(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Pagination
  const paginatedCountries = countries.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box 
      sx={{ 
        maxWidth: 1200, 
        margin: '0 auto',
        padding: 3,
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
            Country State Management
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              Countries
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  placeholder="New Country Name"
                  value={newCountry}
                  onChange={(e) => setNewCountry(e.target.value)}
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
                  onClick={handleAddCountry}
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
                  ADD COUNTRY
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
                    <TableCell sx={{ fontWeight: 600, color: 'black' }}>Country Name</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'black' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...paginatedCountries].reverse().map((country) => (
                    <TableRow 
                      key={country.countryId}
                      onClick={() => setSelectedCountryId(country.countryId)}
                      sx={{ 
                        cursor: 'pointer',
                        bgcolor: selectedCountryId === country.countryId ? alpha('#000', 0.04) : 'inherit',
                        '&:hover': { 
                          bgcolor: alpha('#000', 0.02),
                        },
                      }}
                    >
                      <TableCell>{country.country}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(country);
                          }}
                          sx={{ color: 'black' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(country);
                          }}
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
                count={countries.length}
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
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <StateTable countries={countries} selectedCountryId={selectedCountryId} />
        </Grid>
      </Grid>

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
            Are you sure you want to delete this country? This action cannot be undone.
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
              Edit Country
            </Typography>
            <TextField
              label="Country Name"
              value={currentCountry?.country || ''}
              onChange={(e) => setCurrentCountry({ ...currentCountry, country: e.target.value })}
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
