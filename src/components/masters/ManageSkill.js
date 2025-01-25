
// "use client";
// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Button,
//   IconButton,
//   TextField,
//   Modal,
//   Box,
//   Tooltip,
//   TableSortLabel,
//   TablePagination,
//   Typography,
//   Alert
// } from '@mui/material';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CloseIcon from '@mui/icons-material/Close';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSkills, addSkill, updateSkill, deleteSkill } from '../../redux/slices/skillSlice';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   borderRadius: '8px',
// };

// export default function SkillTable() {
//   const [newSkill, setNewSkill] = useState('');
//   const [open, setOpen] = useState(false);
//   const [currentSkill, setCurrentSkill] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [orderBy, setOrderBy] = useState('skill');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [searchQuery, setSearchQuery] = useState('');

//   const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
//   const [skillToDelete, setSkillToDelete] = useState(null);

//   const dispatch = useDispatch();
//   const skills = useSelector((state) => state.skills.skills || []); // Ensure it is an array
//   const error = useSelector((state) => state.skills.error);
//   const success = useSelector((state) => state.skills.success);

//   useEffect(() => {
//     dispatch(fetchSkills());
//   }, [dispatch]);

//   const handleAddSkill = () => {
//     if (newSkill.trim()) {
//       // Dispatch the add skill action
//       dispatch(addSkill(newSkill.trim()));

//       // Add the new skill at the top of the skills list
//       const newSkillData = { skillId: Date.now(), skill: newSkill.trim() }; // Adjust based on your response
//       const updatedSkills = [newSkillData, ...skills]; // Add new skill at the top

//       // Reset the pagination to the first page
//       setPage(0);

//       // Clear the input field
//       setNewSkill('');
//     }
//   };

//   const handleEdit = (skill) => {
//     setCurrentSkill(skill);
//     setOpen(true);
//   };

//   const handleDeleteClick = (skill) => {
//     // Open the confirmation modal and set the skill to delete
//     setSkillToDelete(skill);
//     setOpenDeleteConfirmation(true);
//   };

//   const handleConfirmDelete = () => {
//     // Dispatch the delete action and close the modal
//     if (skillToDelete) {
//       dispatch(deleteSkill(skillToDelete.skillId));
//       setOpenDeleteConfirmation(false);
//       setSkillToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     // Close the modal without deleting
//     setOpenDeleteConfirmation(false);
//     setSkillToDelete(null);
//   };

//   const handleSave = () => {
//     dispatch(updateSkill(currentSkill));
//     setOpen(false);
//     setCurrentSkill(null);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleRequestSort = (property) => {
//     const isAsc = orderBy === property && sortDirection === 'asc';
//     setSortDirection(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value.toLowerCase());
//   };

//   const filteredSkills = skills.filter((skill) =>
//     skill.skill.toLowerCase().includes(searchQuery)
//   );

//   const sortedSkills = filteredSkills.sort((a, b) => {
//     if (orderBy === 'skill') {
//       return (a.skill > b.skill ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
//     }
//     return 0;
//   });

//   const paginatedSkills = sortedSkills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
//       {/* Display success message */}
//       {success && (
//         <Alert severity="success" style={{ marginBottom: 20 }}>
//           {success}
//         </Alert>
//       )}

//       {/* Error Message Display */}
//       {error && (
//         <Alert severity="error" style={{ marginBottom: 20 }}>
//           {error}
//         </Alert>
//       )}
//       {/* Add Skill and Search Section */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//         <div style={{ display: 'flex', alignItems: 'center' }}>
//           <TextField
//             label="Add Skill"
//             value={newSkill}
//             onChange={(e) => setNewSkill(e.target.value)}
//             variant="outlined"
//             style={{ marginRight: 16, width: 250 }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddCircleIcon />}
//             onClick={handleAddSkill}
//             style={{ minWidth: 120 }}
//           >
//             Add Skill
//           </Button>
//         </div>
//         <TextField
//           label="Search Skills"
//           value={searchQuery}
//           onChange={handleSearchChange}
//           fullWidth
//           variant="outlined"
//           style={{ maxWidth: 300 }}
//         />
//       </div>

//       {/* Skills Table */}
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell style={{ fontWeight: 'bold' }}>
//               <TableSortLabel
//                 active={orderBy === 'skill'}
//                 direction={sortDirection}
//                 onClick={() => handleRequestSort('skill')}
//               >
//                 Skill
//               </TableSortLabel>
//             </TableCell>
//             <TableCell align="right" style={{ fontWeight: 'bold' }}>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {[...skills].reverse().map((skill) => (
//             <TableRow key={skill.skillId}>
//               <TableCell>{skill.skill}</TableCell>
//               <TableCell align="right">
//                 <Tooltip title="Edit">
//                   <IconButton color="primary" onClick={() => handleEdit(skill)}>
//                     <EditIcon />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Delete">
//                   <IconButton color="error" onClick={() => handleDeleteClick(skill)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </Tooltip>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       {/* Pagination */}
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredSkills.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />

//       {/* Edit Modal */}
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={style}>
//           {/* Close Icon */}
//           <IconButton
//             onClick={handleClose}
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               color: 'gray',  // You can change the color of the icon
//             }}
//           >
//             <CloseIcon />
//           </IconButton>

//           {/* Modal Title */}
//           <Typography variant="h6" component="h2" gutterBottom align="center" marginBottom="20px">
//             Edit Skill
//           </Typography>

//           {/* Skill Input Field */}
//           <TextField
//             label="Skill Name"
//             value={currentSkill?.skill || ''}
//             onChange={(e) => setCurrentSkill({ ...currentSkill, skill: e.target.value })}
//             fullWidth
//             variant="outlined"
//             sx={{ mb: 2 }} // Margin-bottom for spacing
//           />

//           {/* Save Button */}
//           <Box display="flex" justifyContent="right">
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSave}
//               sx={{
//                 minWidth: 80,
//                 padding: '8px 12px',  // Optional: Adds more padding to the button
//                 borderRadius: '4px',
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       {/* Delete Confirmation Modal */}
//       <Modal open={openDeleteConfirmation} onClose={handleCancelDelete}>
//         <Box sx={style}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             Are you sure you want to delete this skill?
//           </Typography>
//           <Box display="flex" justifyContent="space-between" mt={2}>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleCancelDelete}
//               sx={{ width: '48%' }}
//             >
//               No
//             </Button>
//             <Button
//               variant="contained"
//               color="error"
//               onClick={handleConfirmDelete}
//               sx={{ width: '48%' }}
//             >
//               Yes
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </div>
//   );
// }


"use client";
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Modal,
  Box,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Typography,
  Alert,
  Paper,
  TableContainer,
  Fade,
  Divider,
  alpha
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSkills, addSkill, updateSkill, deleteSkill } from '../../redux/slices/skillSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
  outline: 'none',
};

export default function SkillTable() {
  const [newSkill, setNewSkill] = useState('');
  const [open, setOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [orderBy, setOrderBy] = useState('skill');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [alertTimeout, setAlertTimeout] = useState(null);

  const dispatch = useDispatch();
  const skills = useSelector((state) => state.skills.skills || []); // Ensure it is an array
  const error = useSelector((state) => state.skills.error);
  const success = useSelector((state) => state.skills.success);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (success || error) {
      // Clear any existing timeout
      if (alertTimeout) {
        clearTimeout(alertTimeout);
      }

      // Set new timeout
      const timeout = setTimeout(() => {
        // Reset success and error in Redux state
        dispatch({ type: 'skills/resetMessages' });
      }, 3000);

      // Save timeout ID
      setAlertTimeout(timeout);

      // Cleanup
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [success, error, dispatch]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      // Dispatch the add skill action
      dispatch(addSkill(newSkill.trim()));
      setNewSkill('');
    }
  };

  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setOpen(true);
  };

  const handleDeleteClick = (skill) => {
    setSkillToDelete(skill);
    setOpenDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (skillToDelete) {
      dispatch(deleteSkill(skillToDelete.skillId));
      setOpenDeleteConfirmation(false);
      setSkillToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteConfirmation(false);
    setSkillToDelete(null);
  };

  const handleSave = () => {
    if (currentSkill) {
      dispatch(updateSkill(currentSkill));
      setOpen(false);
      setCurrentSkill(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentSkill(null);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setPage(0); // Reset to first page when searching
  };

  // Filter out any undefined or invalid skills and then apply search
  const filteredSkills = skills
    .filter(skill => skill && typeof skill === 'object' && skill.skill) // Filter out invalid skills
    .filter(skill => skill.skill.toLowerCase().includes(searchQuery));

  // Sort the filtered skills
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (orderBy === 'skill') {
      const skillA = (a.skill || '').toLowerCase();
      const skillB = (b.skill || '').toLowerCase();
      return (skillA > skillB ? 1 : -1) * (sortDirection === 'asc' ? 1 : -1);
    }
    return 0;
  });

  const paginatedSkills = sortedSkills.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '24px',
      '& .MuiTextField-root': { m: 1 }
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: '#1a237e' }}>
          Manage Skills
        </Typography>

        {/* Success and Error Alerts */}
        <Fade in={Boolean(success)}>
          <Box sx={{ mb: 2 }}>
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { fontSize: '1.2rem' }
                }}
              >
                {success}
              </Alert>
            )}
          </Box>
        </Fade>

        <Fade in={Boolean(error)}>
          <Box sx={{ mb: 2 }}>
            {error && (
              <Alert 
                severity="error"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-icon': { fontSize: '1.2rem' }
                }}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Fade>

        {/* Add Skill and Search Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3 
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: '1 1 auto',
            minWidth: '300px'
          }}>
            <TextField
              label="Add Skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ 
                mr: 2,
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#000', 0.01)
                  }
                }
              }}
            />
            <Button
              variant="contained"
              color="#000000"
              startIcon={<AddCircleIcon />}
              onClick={handleAddSkill}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                textTransform: 'none',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }
              }}
            >
              Add Skill
            </Button>
          </Box>
          <Box sx={{ 
            position: 'relative',
            flex: '0 1 300px'
          }}>
            <SearchIcon sx={{ 
              position: 'absolute',
              left: 2,
              top: '50%',
              transform: 'translateY(-50%)',
              ml: 1,
              color: 'text.secondary'
            }} />
            <TextField
              placeholder="Search skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  pl: 5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: alpha('#000', 0.01)
                  }
                }
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Skills Table */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: '#1a237e',
                  bgcolor: alpha('#1a237e', 0.02)
                }}>
                  <TableSortLabel
                    active={orderBy === 'skill'}
                    direction={sortDirection}
                    onClick={() => handleRequestSort('skill')}
                  >
                    Skill
                  </TableSortLabel>
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1a237e',
                    bgcolor: alpha('#1a237e', 0.02)
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSkills.map((skill) => (
                <TableRow 
                  key={skill.skillId}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha('#1a237e', 0.01),
                      '& .action-buttons': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <TableCell>{skill.skill}</TableCell>
                  <TableCell align="right">
                    <Box 
                      className="action-buttons"
                      sx={{ 
                        opacity: 0.7,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleEdit(skill)}
                          sx={{ 
                            color: 'primary.main',
                            '&:hover': { 
                              bgcolor: alpha('#1a237e', 0.08)
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton 
                          size="small"
                          onClick={() => handleDeleteClick(skill)}
                          sx={{ 
                            color: 'error.main',
                            ml: 1,
                            '&:hover': { 
                              bgcolor: alpha('#f44336', 0.08)
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSkills.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: 1,
              borderColor: 'divider'
            }}
          />
        </TableContainer>
      </Paper>

      {/* Edit Modal */}
      <Modal 
        open={open} 
        onClose={handleClose}
        closeAfterTransition
      >
        <Fade in={open}>
          <Box sx={style}>
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'text.secondary',
                '&:hover': { 
                  bgcolor: alpha('#000', 0.04)
                }
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                textAlign: 'center',
                color: '#1a237e',
                fontWeight: 600
              }}
            >
              Edit Skill
            </Typography>

            <TextField
              label="Skill Name"
              value={currentSkill?.skill || ''}
              onChange={(e) => setCurrentSkill({ ...currentSkill, skill: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        open={openDeleteConfirmation} 
        onClose={handleCancelDelete}
        closeAfterTransition
      >
        <Fade in={openDeleteConfirmation}>
          <Box sx={style}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: '#1a237e',
                fontWeight: 600
              }}
            >
              Delete Skill
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              Are you sure you want to delete this skill? This action cannot be undone.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2,
              justifyContent: 'flex-end'
            }}>
              <Button
                variant="outlined"
                onClick={handleCancelDelete}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
