// "use client";
// import React, { useState, useEffect } from 'react';
// import { Box, TextField, Button, Typography, Paper, IconButton, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// const AddUser = () => {
//   const [userDetails, setUserDetails] = useState({
//     fullName: '',
//     email: '',
//     username: '',
//     password: '',
//     role: '',
//     contact: '',
//   });
//   const [error, setError] = useState('');
//   const [successPopup, setSuccessPopup] = useState(false); // Track the success popup visibility
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [authToken, setAuthToken] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       setAuthToken(token);
//     } else {
//       router.push('/');
//     }
//   }, []);

//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   const validateUsername = (username) => {
//     const usernameRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
//     return usernameRegex.test(username);
//   };

//   const validatePassword = (password) => password.length >= 8;

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUserDetails((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleAddUser = async (e) => {
//     e.preventDefault();

//     if (!userDetails.fullName || !userDetails.email || !userDetails.username || !userDetails.password || !userDetails.role || !userDetails.contact) {
//       setError('All fields are required.');
//       return;
//     }

//     if (!validateEmail(userDetails.email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     if (!validateUsername(userDetails.username)) {
//       setError('Username at least 8 characters, contain a number, and a special character.');
//       return;
//     }

//     if (!validatePassword(userDetails.password)) {
//       setError('Password at least 8 characters.');
//       return;
//     }

//     setError('');
//     try {
//       const response = await axios.post(
//         'http://localhost:8000/api/hrms/register',
//         userDetails,
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`, // Add token to headers
//           },
//         }
//       );

//       if (response.status === 200) {
//         // Display success popup
//         setSuccessPopup(true);

//         // Clear the form fields
//         setUserDetails({
//           fullName: '',
//           email: '',
//           username: '',
//           password: '',
//           role: '',
//           contact: '',
//         });

//         // Redirect after 2 seconds
//         setTimeout(() => {
//           setSuccessPopup(false); // Hide the popup
//           router.push('/dashboard');
//         }, 2000);
//       } else {
//         setError(response.data.message || 'Failed to add user. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error adding user:', error);
//       setError('An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//       <Paper
//         sx={{
//           position: 'relative',
//           height: '70vh',
//           width: '110vh',
//           backgroundColor: 'white',
//           padding: '30px',
//           borderRadius: '8px',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginTop: "80px"
//         }}
//       >
//         <Typography variant="h5" sx={{ marginTop: "10px", fontWeight: '800', fontSize: "2em" }}>
//           Add New User
//         </Typography>

//         {/* Error Message */}
//         <Box
//           sx={{
//             color: '#F34040',
//             backgroundColor: '#FBDBDB',
//             borderRadius: '10px',
//             padding: '3px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '25px',
//             height: error ? 'auto' : '0px',
//             minHeight: '35px',
//             visibility: error ? 'visible' : 'hidden',
//             opacity: error ? 1 : 0,
//             transition: 'visibility 0s, opacity 0.3s ease',
//             marginBottom: '30px',
//             marginTop: "30px"
//           }}
//         >
//           <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
//           <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
//             {error}
//           </Typography>
//         </Box>

//         {/* Success Popup */}
//         {successPopup && (
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '20%',
//               backgroundColor: 'green',
//               color: 'white',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: 1000,
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//             }}
//           >
//             <Typography variant="body1" sx={{ marginRight: '10px' }}>
//               User Registration is successful
//             </Typography>
//           </Box>
//         )}

//         <form onSubmit={handleAddUser} style={{ width: '80%' }}>
//           <Box sx={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
//             <TextField
//               label="Full Name"
//               name="fullName"
//               value={userDetails.fullName}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//               }}
//             />
//             <TextField
//               label="Username"
//               name="username"
//               value={userDetails.username}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//               }}
//             />
//           </Box>

//           <Box sx={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
//             <TextField
//               label="Email"
//               name="email"
//               value={userDetails.email}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//               }}
//             />
//             <TextField
//               label="Password"
//               type={passwordVisible ? 'text' : 'password'}
//               name="password"
//               value={userDetails.password}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//               }}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     edge="end"
//                     sx={{
//                       position: 'absolute',
//                       right: 12,
//                       padding: '10px',
//                       color: 'black',
//                     }}
//                   >
//                     {passwordVisible ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 ),
//               }}
//             />
//           </Box>

//           <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px', maxWidth: '800px' }}>
//             <TextField
//               label="Contact"
//               name="contact"
//               value={userDetails.contact}
//               onChange={handleInputChange}
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//               }}
//             />
//             <FormControl
//               fullWidth
//               margin="normal"
//               sx={{
//                 '& .MuiInputLabel-root': {
//                   color: 'gray',
//                 },
//                 '& .MuiInputLabel-root.Mui-focused': {
//                   color: 'black',
//                 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '10px',
//                   '& fieldset': {
//                     borderColor: 'black',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: 'gray',
//                   },
//                 },
//               }}
//             >
//               <InputLabel id="role-label">Role</InputLabel>
//               <Select
//                 labelId="role-label"
//                 id="role"
//                 name="role"
//                 value={userDetails.role}
//                 onChange={handleInputChange}
//                 label="Role"
//               >
//                 <MenuItem value="Super Admin">Super Admin</MenuItem>
//                 <MenuItem value="CPC">CPC</MenuItem>
//                 <MenuItem value="Admin">Admin</MenuItem>
//                 <MenuItem value="HR">HR</MenuItem>
//                 <MenuItem value="Employee(Intern)">Employee(Intern)</MenuItem>
//                 <MenuItem value="Employee(Regular)">Employee(Regular)</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>

//           <Box sx={{ display: 'flex', justifyContent: 'center ', width: '100%', marginTop: '65px' }}>
//             <Button
//               type="submit"
//               variant="contained"
//               sx={{
//                 backgroundColor: 'black',
//                 color: 'white',
//                 padding: '10px 20px',
//                 borderRadius: '8px',
//                 width: '200px',
//                 '&:hover': { backgroundColor: 'black' },
//               }}
//             >
//               Add User
//             </Button>
//           </Box>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default AddUser;


"use client";
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, IconButton, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddUser = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    role: '',
    contact: '',
  });
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      router.push('/');
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => password.length >= 8;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if the value contains a URL
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    if (urlPattern.test(value)) {
      setError('URLs are not allowed in this field');
      return;
    }
    
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle paste event for all input fields
  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    
    if (urlPattern.test(pastedText)) {
      e.preventDefault();
      setError('URLs are not allowed in this field');
    }
  };

  const resetForm = () => {
    setUserDetails({
      fullName: '',
      email: '',
      username: '',
      password: '',
      role: '',
      contact: '',
    });
    setError('');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!userDetails.fullName || !userDetails.email || !userDetails.username || !userDetails.password || !userDetails.role || !userDetails.contact) {
      setError('All fields are required.');
      return;
    }

    if (!validateEmail(userDetails.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateUsername(userDetails.username)) {
      setError('Username at least 8 characters, contain a number, and a special character.');
      return;
    }

    if (!validatePassword(userDetails.password)) {
      setError('Password at least 8 characters.');
      return;
    }

    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8000/api/hrms/register',
        userDetails,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log('API Response:', response); // Debug log

      // Clear form fields first
      setUserDetails({
        fullName: '',
        email: '',
        username: '',
        password: '',
        role: '',
        contact: '',
      });

      // Set success message and show toast
      setSuccessMessage('User registered successfully!');
      setOpenSnackbar(true);
      
      // Redirect after toast
      setTimeout(() => {
        router.push('/manage-users');
      }, 2000);
    } catch (error) {
      console.error('Error adding user:', error);
      setError(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper
        sx={{
          position: 'relative',
          height: '70vh',
          width: '110vh',
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: "80px"
        }}
      >
        <Typography variant="h5" sx={{ marginTop: "10px", fontWeight: '800', fontSize: "2em" }}>
          Add New User
        </Typography>

        {/* Error Message */}
        {error && (
          <Box
            sx={{
              color: '#F34040',
              backgroundColor: '#FBDBDB',
              borderRadius: '10px',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '25px',
              marginBottom: '30px',
              marginTop: "30px"
            }}
          >
            <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          </Box>
        )}

        <form onSubmit={handleAddUser} style={{ width: '80%' }}>
          <Box sx={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={userDetails.fullName}
              onChange={handleInputChange}
              onPaste={handlePaste}
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
              value={userDetails.username}
              onChange={handleInputChange}
              onPaste={handlePaste}
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
          </Box>

          <Box sx={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
            <TextField
              label="Email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              onPaste={handlePaste}
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
              label="Password"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={userDetails.password}
              onChange={handleInputChange}
              onPaste={handlePaste}
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
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    edge="end"
                    sx={{
                      position: 'absolute',
                      right: 12,
                      padding: '10px',
                      color: 'black',
                    }}
                  >
                    {passwordVisible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: '20px', marginBottom: '10px', maxWidth: '800px' }}>
            <TextField
              label="Contact"
              name="contact"
              value={userDetails.contact}
              onChange={handleInputChange}
              onPaste={handlePaste}
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
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={userDetails.role}
                onChange={handleInputChange}
                label="Role"
              >
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="CPC">CPC</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Employee(Intern)">Employee(Intern)</MenuItem>
                <MenuItem value="Employee(Regular)">Employee(Regular)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center ', width: '100%', marginTop: '65px' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: 'black',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                width: '200px',
                '&:hover': { backgroundColor: 'black' },
              }}
            >
              Add User
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Toast Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ 
            backgroundColor: '#4CAF50',
            color: '#fff',
            width: '100%',
            minWidth: '300px',
            fontSize: '1rem',
            '& .MuiAlert-icon': {
              color: '#fff'
            },
            '& .MuiAlert-message': {
              color: '#fff'
            }
          }}
        >
          User registered successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddUser;
