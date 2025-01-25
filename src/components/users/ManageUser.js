// 'use client';

// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";  
// import CloseIcon from "@mui/icons-material/Close";  
// import DeleteIcon from "@mui/icons-material/Delete";  
// import EditIcon from "@mui/icons-material/Edit";  
// import { useSelector, useDispatch } from "react-redux";
// import { fetchUsers, deleteUser, updateUser } from "../../redux/slices/userSlice";
// import { useRouter } from 'next/navigation'; 

// const ManageUser = () => {
//   const dispatch = useDispatch();
//   const { data: users, loading, error } = useSelector((state) => state.user);
//   const [hasUsers, setHasUsers] = useState(true);  
//   const [anchorEl, setAnchorEl] = useState(null);  
//   const [selectedUser, setSelectedUser] = useState(null);  
//   const [openEditDialog, setOpenEditDialog] = useState(false);  
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
//   const [authToken, setAuthToken] = useState('');
//   const router = useRouter();
  
//   const [userFormData, setUserFormData] = useState({
//     fullName: '',
//     username: '',
//     email: '',
//     contact: '',
//     role: '',
//   });
  
//   const [formErrors, setFormErrors] = useState({
//     username: "",
//     email: "",
//     contact: "",
//   }); 

//   useEffect(() => {
//     // Retrieve the token from local storage when the component mounts
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       setAuthToken(token);
//       dispatch(fetchUsers());
//     } else {
//       router.push('/');
//     }
//   }, []);

//   const handleMenuOpen = (event, user) => {
//     setSelectedUser(user); 
//     setAnchorEl(event.currentTarget); 
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);  
//   };

//   const handleEditUser = (user) => {
//     setUserFormData({
//       fullName: user.fullName,
//       username: user.username,
//       email: user.email,
//       contact: user.contact,
//       role: user.role,
//     });
//     setSelectedUser(user);
//     setOpenEditDialog(true);
//     handleMenuClose();
//   };

//   console.log("fgg",selectedUser);
  
//   const handleSaveChanges = async () => {
//     try {
//       await dispatch(updateUser({ id: selectedUser.id, ...userFormData })).unwrap();
//       dispatch(fetchUsers());
//       setOpenEditDialog(false);
//     } catch (error) {
//       console.error('Error updating user:', error);
//     }
//   };

//   const handleDeleteUser = () => {
//     setOpenDeleteDialog(true);  
//     handleMenuClose(); 
//   };
  
//   const confirmDeleteUser = () => {
//     if (selectedUser) {
//       dispatch(deleteUser(selectedUser.id)); 
//       setOpenDeleteDialog(false); 
//     }
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     let errorMessage = "";

//     if (name === "username") {
//       const usernameRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
//       if (!usernameRegex.test(value)) {
//         errorMessage = "Username must be at least 8 characters, include a number and a special character.";
//       }
//     } else if (name === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(value)) {
//         errorMessage = "Please enter a valid email address.";
//       }
//     } else if (name === "contact") {
//       const contactRegex = /^\d{0,10}$/; 
//       if (!contactRegex.test(value)) {
//         errorMessage = "Contact number must be numeric and up to 10 digits.";
//       }
//     }

//     setFormErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: errorMessage,
//     }));

//     setUserFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography>Loading users...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography color="error">Error: {error}</Typography>
//       </Box>
//     );
//   }
  

//   return (
//     <Box
//       sx={{
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         position: "flex",
//       }}
//     >
//       <Typography variant="h4" sx={{ fontWeight: "700", marginTop: "5px" }}>
//         Manage Users
//       </Typography>

//       <Grid container spacing={1}>
//         {users && users.map((user) => (
//           <Grid item xs={12} sm={6} md={3} key={user.userId}>
//             <Card
//               sx={{
//                 maxWidth: 330,
//                 height: "75%",
//                 padding: 1,
//                 borderRadius: "10px",
//                 boxShadow: 5,
//                 marginBottom: "-5px",
//                 marginTop: "60px",
//                 marginLeft: '25px'
//               }}
//             >
//               <CardContent>
//                 <div style={{ display: "flex", justifyContent: "space-between" }}>
//                   <Typography
//                     variant="body2"
//                     component="div"
//                     gutterBottom
//                     sx={{ marginTop: 2, marginBottom: 0 }}
//                   >
//                     <strong>Full Name:</strong> {user.fullName}
//                   </Typography>
//                   <IconButton
//                     onClick={(event) => handleMenuOpen(event, user)}
//                     sx={{ color: "black", marginTop: "-20px", marginRight: "-10px" }}
//                   >
//                     <MoreVertIcon />
//                   </IconButton>
//                 </div>
//                 <Typography variant="body2" sx={{ marginBottom: 0 }}>
//                   <strong>Username:</strong> {user.username}
//                 </Typography>
//                 <Typography variant="body2" sx={{ marginBottom: 0 }}>
//                   <strong>Email:</strong> {user.email}
//                 </Typography>
//                 <Typography variant="body2" sx={{ marginBottom: 0 }}>
//                   <strong>Contact Number:</strong> {user.contact}
//                 </Typography>
//                 <Typography variant="body2" sx={{ marginBottom: 0 }}>
//                   <strong>Role:</strong> {user.role}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//         <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//           <MenuItem onClick={() => handleEditUser(selectedUser)}>
//             <EditIcon sx={{ marginRight: 1 }} />
//             Edit
//           </MenuItem>
//           <MenuItem onClick={handleDeleteUser}>
//             <DeleteIcon sx={{ marginRight: 1 }} />
//             Delete
//           </MenuItem>
//         </Menu>
//       </Grid>

//       {/* Dialog for editing user details */}
//       <Dialog
//         open={openEditDialog}
//         onClose={() => setOpenEditDialog(false)}
//         sx={{
//           '& .MuiDialog-paper': {
//             width: '700px',
//             height: '610px',
//             marginLeft: "280px"
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: '600', marginLeft: '30%', marginTop: "10px" }}>
//           Edit User Details
//           <IconButton
//             edge="end"
//             color="inherit"
//             onClick={() => setOpenEditDialog(false)}
//             sx={{ position: "absolute", right: 28, top: 7, color: "black" }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>
//         <DialogContent sx={{ marginTop: "20px" }}>
//           <TextField
//             label="Full Name"
//             name="fullName"
//             value={userFormData.fullName}
//             onChange={handleFormChange}
//             fullWidth
//             margin="normal"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '10px',
//                 '& fieldset': {
//                   borderColor: 'black',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: 'gray',
//                 },
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'gray',
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: 'black',
//               },
//             }}
//           />
//           <TextField
//             label="Username"
//             name="username"
//             value={userFormData.username}
//             onChange={handleFormChange}
//             fullWidth
//             margin="normal"
//             error={!!formErrors.username}
//             helperText={formErrors.username}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '10px',
//                 '& fieldset': {
//                   borderColor: 'black',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: 'gray',
//                 },
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'gray',
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: 'black',
//               },
//             }}
//           />
//           <TextField
//             label="Email"
//             name="email"
//             value={userFormData.email}
//             onChange={handleFormChange}
//             fullWidth
//             margin="normal"
//             error={!!formErrors.email}
//             helperText={formErrors.email}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '10px',
//                 '& fieldset': {
//                   borderColor: 'black',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: 'gray',
//                 },
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'gray',
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: 'black',
//               },
//             }}
//           />
//           <TextField
//             label="Contact Number"
//             name="contact"
//             value={userFormData.contact}
//             onChange={handleFormChange}
//             fullWidth
//             margin="normal"
//             error={!!formErrors.contact}
//             helperText={formErrors.contact}
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '10px',
//                 '& fieldset': {
//                   borderColor: 'black',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: 'gray',
//                 },
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'gray',
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: 'black',
//               },
//             }}
//           />
//           <FormControl
//             fullWidth
//             margin="normal"
//             sx={{
//               '& .MuiInputLabel-root': {
//                 color: 'gray',
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: 'black',
//               },
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '10px',
//                 '& fieldset': {
//                   borderColor: 'black',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: 'gray',
//                 },
//               },
//             }}
//           >
//             <InputLabel>Role</InputLabel>
//             <Select name="role" value={userFormData.role} onChange={handleFormChange} label="Role">
//               <MenuItem value="Super Admin">Super Admin</MenuItem>
//               <MenuItem value="CPC">CPC</MenuItem>
//               <MenuItem value="Admin">Admin</MenuItem>
//               <MenuItem value="HR">HR</MenuItem>
//               <MenuItem value="Employee(Intern)">Employee(Intern)</MenuItem>
//               <MenuItem value="Employee(Regular)">Employee(Regular)</MenuItem>
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={handleSaveChanges}
//             type="submit"
//             variant="contained"
//             sx={{
//               backgroundColor: 'black',
//               color: 'white',
//               padding: '5px 10px',
//               borderRadius: '8px',
//               width: '100px',
//               marginBottom: '20px',
//               marginRight: "18px",
//               '&:hover': { backgroundColor: 'black' },
//             }}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Dialog for delete confirmation */}
//       <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
//         <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancel</Button>
//           <Button onClick={confirmDeleteUser} color="primary">Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default ManageUser;

































'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Tooltip,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser, updateUser } from "../../redux/slices/userSlice";
import { useRouter } from 'next/navigation';

const ManageUser = () => {
  const dispatch = useDispatch();
  const { data: users, loading, error } = useSelector((state) => state.user);
  const [hasUsers, setHasUsers] = useState(true);  
  const [anchorEl, setAnchorEl] = useState(null);  
  const [selectedUser, setSelectedUser] = useState(null);  
  const [openEditDialog, setOpenEditDialog] = useState(false);  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); 
  const [authToken, setAuthToken] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const router = useRouter();
  
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    contact: '',
    role: '',
  });
  
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    contact: "",
  }); 

  useEffect(() => {
    // Retrieve the token from local storage when the component mounts
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      dispatch(fetchUsers());
    } else {
      router.push('/');
    }
  }, []);

  const handleMenuOpen = (event, user) => {
    setSelectedUser(user); 
    setAnchorEl(event.currentTarget); 
  };

  const handleMenuClose = () => {
    setAnchorEl(null);  
  };

  const handleEditUser = (user) => {
    setUserFormData({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      contact: user.contact,
      role: user.role,
    });
    setSelectedUser(user);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  console.log("fgg",selectedUser);
  
  const handleSaveChanges = async () => {
    try {
      await dispatch(updateUser({ id: selectedUser.id, ...userFormData })).unwrap();
      dispatch(fetchUsers());
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = () => {
    setOpenDeleteDialog(true);  
    handleMenuClose(); 
  };
  
  const confirmDeleteUser = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser.id)); 
      setToast({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      setOpenDeleteDialog(false); 
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    if (name === "username") {
      const usernameRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
      if (!usernameRegex.test(value)) {
        errorMessage = "Username must be at least 8 characters, include a number and a special character.";
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = "Please enter a valid email address.";
      }
    } else if (name === "contact") {
      const contactRegex = /^\d{0,10}$/; 
      if (!contactRegex.test(value)) {
        errorMessage = "Contact number must be numeric and up to 10 digits.";
      }
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    setUserFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading users...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
  

  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "flex",
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}
    >
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: "700", 
          marginTop: "5px",
          marginBottom: "40px",
          color: '#1a1a1a',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            backgroundColor: '#000',
            borderRadius: '2px'
          }
        }}
      >
        Manage Users
      </Typography>

      <Grid container spacing={3}>
        {users && users.map((user) => (
          <Grid item xs={12} sm={6} md={3} key={user.userId}>
            <Card
              sx={{
                maxWidth: 330,
                height: "100%",
                borderRadius: "16px",
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                backgroundColor: '#fff',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                },
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Profile Icon Section */}
                <Box
                  sx={{
                    width: '100%',
                    height: 100,
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30%',
                      background: 'linear-gradient(to top, #000, transparent)',
                      opacity: 0.3
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: '#333',
                      border: '4px solid #fff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>

                {/* Card Content */}
                <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, user)}
                      size="small"
                      sx={{ 
                        color: '#666',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        mb: 1,
                        fontSize: '1.1rem'
                      }}
                    >
                      {user.fullName}
                    </Typography>
                    <Chip
                      label={user.role}
                      size="small"
                      icon={<AdminPanelSettingsIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        backgroundColor: user.role === 'admin' ? '#ffeeed' : '#e3f2fd',
                        color: user.role === 'admin' ? '#d32f2f' : '#1976d2',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: 'inherit'
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <BadgeIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {user.username}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <EmailIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {user.email}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <PhoneIcon sx={{ color: '#666', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                        {user.contact}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiAlert-root': {
            backgroundColor: toast.severity === 'success' ? '#4caf50' : '#f44336',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }
        }}
      >
        <Alert 
          severity={toast.severity}
          variant="filled"
          sx={{ 
            minWidth: '250px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Menu for edit/delete actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            minWidth: '150px'
          }
        }}
      >
        <MenuItem 
          onClick={() => handleEditUser(selectedUser)}
          sx={{
            gap: 1,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
          }}
        >
          <EditIcon fontSize="small" sx={{ color: '#1976d2' }} />
          <Typography>Edit</Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteUser}
          sx={{
            gap: 1,
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
          }}
        >
          <DeleteIcon fontSize="small" sx={{ color: '#d32f2f' }} />
          <Typography>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Dialog for editing user details */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        sx={{
          '& .MuiDialog-paper': {
            width: '700px',
            height: '610px',
            marginLeft: "280px"
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: '600', marginLeft: '30%', marginTop: "10px" }}>
          Edit User Details
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setOpenEditDialog(false)}
            sx={{ position: "absolute", right: 28, top: 7, color: "black" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ marginTop: "20px" }}>
          <TextField
            label="Full Name"
            name="fullName"
            value={userFormData.fullName}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
          <TextField
            label="Username"
            name="username"
            value={userFormData.username}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={!!formErrors.username}
            helperText={formErrors.username}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
          <TextField
            label="Email"
            name="email"
            value={userFormData.email}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
          <TextField
            label="Contact Number"
            name="contact"
            value={userFormData.contact}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            error={!!formErrors.contact}
            helperText={formErrors.contact}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
            }}
          />
          <FormControl
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputLabel-root': {
                color: 'gray',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                '& fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'gray',
                },
              },
            }}
          >
            <InputLabel>Role</InputLabel>
            <Select name="role" value={userFormData.role} onChange={handleFormChange} label="Role">
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="CPC">CPC</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Employee(Intern)">Employee(Intern)</MenuItem>
              <MenuItem value="Employee(Regular)">Employee(Regular)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaveChanges}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '8px',
              width: '100px',
              marginBottom: '20px',
              marginRight: "18px",
              '&:hover': { backgroundColor: 'black' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            maxWidth: '400px',
            width: '90%'
          }
        }}
      >
        <Box sx={{ 
          position: 'relative',
          backgroundColor: '#fff',
          p: 3,
          textAlign: 'center'
        }}>
          {/* Close button */}
          <IconButton
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Warning Icon */}
          <Box sx={{ mb: 2 }}>
            <DeleteIcon 
              sx={{ 
                fontSize: 64,
                color: '#d32f2f',
                animation: 'fadeIn 0.5s ease-out',
                '@keyframes fadeIn': {
                  '0%': {
                    opacity: 0,
                    transform: 'scale(0.8)'
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'scale(1)'
                  }
                }
              }} 
            />
          </Box>

          {/* Title */}
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              color: '#1a1a1a'
            }}
          >
            Confirm Delete
          </Typography>

          {/* Message */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: 'text.secondary',
              px: 2
            }}
          >
            Are you sure you want to delete {selectedUser?.fullName}? This action cannot be undone.
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'center'
          }}>
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              sx={{
                minWidth: '120px',
                backgroundColor: 'grey.100',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'grey.200'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteUser}
              sx={{
                minWidth: '120px',
                backgroundColor: '#d32f2f',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#b71c1c'
                },
                transition: 'all 0.2s ease-in-out',
                '&:active': {
                  transform: 'scale(0.98)'
                }
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ManageUser;