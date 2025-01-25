// 'use client';

// import React, { useState, useEffect } from "react";
// import { Button, TextField, Typography, Box, IconButton, Paper, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import CloseIcon from "@mui/icons-material/Close"; 
// import { useRouter } from "next/navigation";
// import { useDispatch } from 'react-redux';
// import { login } from '../redux/slices/authSlice';  // Adjust the import path as necessary
// import axios from 'axios'; // Import axios

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");  // For showing global error messages
//   const [showPassword, setShowPassword] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);  // OTP as an array of 6 values
//   const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
//   const [otpError, setOtpError] = useState("");
//   const [otpSent, setOtpSent] = useState(false);  // Track if OTP has been sent
//   const [isLoading, setIsLoading] = useState(false); // New state for loading
//   const [timer, setTimer] = useState(30); // Timer state initialized to 30 seconds
//   const [isResendDisabled, setIsResendDisabled] = useState(true); // To disable/enable the button

//   const router = useRouter();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // Check if the user is already logged in
//     const token = localStorage.getItem("token");
//     if (token) {
//       router.push("/dashboard");
//     }
//   }, [router]);

//   const validateEmail = (email) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setError("Please enter email address and password");
//       return;
//     }

//     setIsLoading(true); // Start loading animation
//     const loginData = { email, password };

//     try {
//       // Replacing fetch with axios POST request for login
//       const response = await axios.post('http://localhost:8000/api/hrms/login', loginData);

//       if (response.status === 200) {
//           setError("");  // Clear error
//           setOtpSent(true);
//           setIsOtpDialogOpen(true);

//           // Delay showing OTP dialog by 2 seconds
//           setTimeout(() => {
//             setIsOtpDialogOpen(true);
//             setIsLoading(false); // Stop loading animation
//           }, 500);
//       } else {
//           setError(response.data.message || "Invalid email or password");
//           setIsLoading(false); // Stop loading animation
//       }
//     } catch (err) {
//         setError("Please enter correct email address and password.");
//         setIsLoading(false); // Stop loading animation
//     }
//   };

//   // POST API request to verify OTP
//   const handleOtpSubmit = async () => {
//     const otpValue = otp.join('');

//     try {
//       // Replacing fetch with axios POST request for OTP verification
//       const response = await axios.post('http://localhost:8000/api/hrms/verifyLogin', { email, otp: otpValue });

//       if (response.status === 200) {
//           const { token, username, role, email, fullname } = response.data;

//           console.log(response.data);
          

//           // Store globally in Redux
//           dispatch(login({ token, username: username, role, email, fullname }));

//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("username", response.data.username);
//           localStorage.setItem("fullname", response.data.fullName);
//           localStorage.setItem("role", response.data.role);
//           localStorage.setItem("email", response.data.email);

//           //dispatch(login({ username: response.data.username }));

//           //setOpenSnackbar(true);
//           router.push("/dashboard");
//       } else {
//           setOtpError(response.data.message || "Invalid OTP. Please try again.");
//       }
//     } catch (err) {
//         setOtpError("An error occurred. Please try again.");
//     }
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleForgotPassword = () => {
//     router.push("/forgot-password");
//   };

//    // Handle OTP input focus and navigation
//    const handleOtpChange = (e, index) => {
//     const value = e.target.value;
    
//     if (/^\d$/.test(value) || value === '') { // Accept only digits or empty value
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       // Move to next field if input is valid
//       if (value && index < otp.length - 1) {
//         document.getElementById(`otp-input-${index + 1}`).focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === 'Backspace') {
//       const newOtp = [...otp];
//       newOtp[index] = '';
//       setOtp(newOtp);

//       // Move to previous field if empty
//       if (index > 0) {
//         document.getElementById(`otp-input-${index - 1}`).focus();
//       }
//     }
//   };

//   const handleOtpDialogClose = () => {
//     setOtpError("");
//     setOtp(["", "", "", "", "", ""]);  // Reset OTP values when dialog is closed
//     setIsOtpDialogOpen(false);
//   };

//   // Function to handle Resend OTP
//   useEffect(() => {
//     let countdown;
//     if (isOtpDialogOpen) {
//       setTimer(30); // Reset timer when dialog opens
//       setIsResendDisabled(true); // Disable the resend button
  
//       countdown = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer <= 1) {
//             clearInterval(countdown);
//             setIsResendDisabled(false); // Enable the resend button when timer reaches 0
//             return 0;
//           }
//           return prevTimer - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(countdown); // Cleanup on component unmount or dialog close
//   }, [isOtpDialogOpen]);
  
  

//   const handleResendOtp = async () => {
//     if (timer === 0) {
//       setOtpError("");  // Clear any existing error
//       setIsLoading(true);  // Start loading animation
  
//       try {
//         // Resend OTP using the login API
//         const response = await axios.post('http://localhost:8000/api/hrms/login', { email, password });
  
//         if (response.status === 200) {
//           setError("");  // Clear error message
//           setIsResendDisabled(true); // Disable the button immediately after resending OTP
//           setTimer(30); // Restart the timer
//           // Start the countdown for the resend button
//           let countdown = setInterval(() => {
//             setTimer((prevTimer) => {
//               if (prevTimer <= 1) {
//                 clearInterval(countdown);
//                 setIsResendDisabled(false); // Enable the button after the timer reaches 0
//                 return 0;
//               }
//               return prevTimer - 1;
//             });
//           }, 1000);
//         } else {
//           setError(response.data.message || "Failed to resend OTP");
//         }
//       } catch (err) {
//         setError("Error resending OTP. Please try again.");
//       } finally {
//         setIsLoading(false);  // Stop loading animation
//       }
//     }
//   };
  

// // const maskEmail = (email) => {
// //   const [name, domain] = email.split("@");
// //   const maskedName = name.length > 4
// //     ? name.substring(0, 4) + "*".repeat(name.length - 8) + name.substring(name.length - 4)
// //     : name;
// //   return `${maskedName}@${domain}`;
// // };
//   const maskEmail = (email) => {
//     // Example of checking for negative count before repeating
//     const maskCount = Math.max(0, email.length -8);  // Ensure count is not negative
//     return email.slice(0, 3) + '*'.repeat(maskCount) + email.slice(-12);
//   };


//   return (
//     <Box sx={{
//       height: '100vh',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       position: 'relative', // For layering
//     overflow: 'hidden',
//     }}>
//       <Box
//         sx={{
//           height: '100%',
//           width: '100%',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           filter: isOtpDialogOpen ? 'blur(5px)' : 'none', // Apply blur when OTP dialog is open
//           transition: 'filter 0.3s ease', // Smooth transition effect
//         }}
//       >
//         <Paper sx={{
//           height: 'auto',
//           width: '50vh',
//           backgroundColor: 'white',
//           padding: '50px',
//           borderRadius: '8px',
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'flex-start',
//           alignItems: 'center',
//         }}>
//           <img src="logo.webp" alt="Logo" style={{ marginBottom: '20px', width: '80px', height: 'auto' }} />

//           <Typography variant="h5" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
//             Sign in to your account
//           </Typography>

//           <Box sx={{
//             color: '#F34040',
//             backgroundColor: '#FBDBDB',
//             borderRadius: '10px',
//             padding: '7px',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontSize: '20px',
//             height: error ? 'auto' : '0px',
//             minHeight: '40px',
//             visibility: error ? 'visible' : 'hidden',
//             opacity: error ? 1 : 0,
//             transition: 'visibility 0s, opacity 0.3s ease',
//             marginBottom: '10px',
//           }}>
//             <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
//             <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
//               {error}
//             </Typography>
//           </Box>

//           <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{
//                 marginBottom: '15px',
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
//               type={showPassword ? "text" : "password"}
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                     sx={{ color: 'black' }}
//                   >
//                     {showPassword ? <Visibility /> : <VisibilityOff />}
//                   </IconButton>
//                 ),
//               }}
//               sx={{
//                 marginBottom: '15px',
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

//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{
//                 marginTop: '10px',
//                 marginBottom: '10px',
//                 color: 'black',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 width: '100%',
//               }}
//               onClick={() => router.push("/forgot-password")}
//             >
//               Forgot Password?
//             </Typography>

//             <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isLoading}
//               sx={{
//                 backgroundColor: 'black',
//                 color: 'white',
//                 padding: '8px 10px',
//                 borderRadius: '8px',
//                 '&:hover': {
//                   backgroundColor: isLoading ? 'black' : 'black',
//                 },
//                 '&.Mui-disabled': {
//                   backgroundColor: 'black',
//                   color: 'white',
//                 },
//               }}
//             >
//               {isLoading ? (
//                 <>
//                   Signing in
//                   <Box
//                     component="span"
//                     sx={{
//                       display: 'inline-flex',
//                       alignItems: 'center',
//                       marginLeft: 1,
//                       '& span': {
//                         width: '6px',
//                         height: '6px',
//                         margin: '0 2px',
//                         borderRadius: '50%',
//                         backgroundColor: 'white',
//                         animation: 'dotPulse 1s infinite ease-in-out',
//                       },
//                       '& span:nth-of-type(1)': { animationDelay: '0s' },
//                       '& span:nth-of-type(2)': { animationDelay: '0.2s' },
//                       '& span:nth-of-type(3)': { animationDelay: '0.4s' },
//                       '& span:nth-of-type(4)': { animationDelay: '0.6s' },
//                     }}
//                   >
//                     <Box component="span"></Box>
//                     <Box component="span"></Box>
//                     <Box component="span"></Box>
//                     <Box component="span"></Box>
//                   </Box>
//                 </>
//               ) : (
//                 "Sign in"
//               )}
//             </Button>

//           </form>
//         </Paper>
//       </Box>

//       {/* OTP Dialog */}
//       <Dialog open={isOtpDialogOpen} onClose={handleOtpDialogClose}>
//         <DialogTitle>
//           <IconButton
//             onClick={handleOtpDialogClose}
//             sx={{
//               position: 'absolute',
//               top: 8,
//               right: 8,
//               color: 'black',
//             }}
//           >
//             <CloseIcon />
//           </IconButton>
//         </DialogTitle>

//         <DialogContent
//           sx={{
//             backgroundColor: 'white',
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               height: '150px',
//               width: '350px',
//               justifyContent: 'flex-start',
//             }}
//           >
//             <Box sx={{ marginBottom: '12px', width: '100%', textAlign: 'left' }}>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontSize: '.9 rem',
//                   color: '#3a3939',
//                   fontWeight: '600',
//                   marginLeft: '10px',
//                 }}
//               >
//                 <span style={{ color: '#e93838', fontSize: "1.5rem", position: 'relative', top: '8px' }}>*</span> OTP is sent to your registered Email :- 
//                 <span style={{ color: '#303030', fontWeight: '500', fontSize: "1rem", marginLeft: "18px" }}>
//                   {maskEmail(email)}
//                 </span>
//               </Typography>
//             </Box>

//             <Box
//               sx={{
//                 height: '5px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               {otpError && (
//                 <Typography
//                   color="error"
//                   variant="body2"
//                   sx={{
//                     textAlign: 'center',
//                     width: '150px',
//                     paddingBottom: '3px',
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     marginTop: "9px"
//                   }}
//                 >
//                   {otpError}
//                 </Typography>
//               )}
//             </Box>

//             <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
//               {otp.map((digit, index) => (
//                 <TextField
//                   className="otp_input"
//                   key={index}
//                   id={`otp-input-${index}`}
//                   value={digit}
//                   onChange={(e) => handleOtpChange(e, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   variant="outlined"
//                   inputProps={{
//                     maxLength: 1,
//                     style: { textAlign: 'center' },
//                   }}
//                   sx={{
//                     width: '40px',
//                     marginRight: '5px',
//                     marginTop: "30px",
//                     '& .MuiOutlinedInput-root': {
//                       borderRadius: '6px',
//                       borderColor: 'red',
//                     },
//                     '& .MuiOutlinedInput-root.Mui-focused': {
//                       borderColor: 'black',
//                     },
//                     '&:hover .MuiOutlinedInput-root': {
//                       borderColor: 'black',
//                     },
//                     '& .MuiInputBase-input': {
//                       height: '40px',
//                       padding: '0',
//                       textAlign: 'center',
//                     },
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
//   {isResendDisabled && (
//     <Typography sx={{ marginRight: 'auto', fontSize: '14px', color: 'gray' }}>
//       Resend OTP in {timer}s
//     </Typography>
//   )}
//   <Button
//     onClick={handleResendOtp}
//     disabled={isResendDisabled}
//     sx={{
//       backgroundColor: isResendDisabled ? '#f7f7f7' : 'black',
//       color: 'white',
//       fontSize: '12px',
//       padding: '5px 10px',
//       borderRadius: '8px',
//       '&:hover': {
//         backgroundColor: isResendDisabled ? 'gray' : '#333',
//       },
//     }}
//   >
//     Resend OTP
//   </Button>
//   <Button
//     onClick={handleOtpSubmit}
//     sx={{
//       backgroundColor: 'black',
//       color: 'white',
//       fontSize: '12px',
//       padding: '5px 10px',
//       borderRadius: '8px',
//       '&:hover': {
//         backgroundColor: '#333',
//       },
//     }}
//   >
//     Verify
//   </Button>
// </DialogActions>


//       </Dialog>
//     </Box>
//   );
// };

// export default Login;


















'use client';

import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, IconButton, Paper, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close"; 
import { useRouter } from "next/navigation";
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice';  // Adjust the import path as necessary
import axios from 'axios'; // Import axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // For showing global error messages
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);  // OTP as an array of 6 values
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);  // Track if OTP has been sent
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [timer, setTimer] = useState(30); // Timer state initialized to 30 seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true); // To disable/enable the button

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter email address and password");
      return;
    }

    setIsLoading(true); // Start loading animation
    const loginData = { email, password };

    try {
      // Replacing fetch with axios POST request for login
      const response = await axios.post('http://localhost:8000/api/hrms/login', loginData);

      if (response.status === 200) {
          setError("");  // Clear error
          setOtpSent(true);
          setIsOtpDialogOpen(true);

          // Delay showing OTP dialog by 2 seconds
          setTimeout(() => {
            setIsOtpDialogOpen(true);
            setIsLoading(false); // Stop loading animation  
          }, 500);
      } else {
          setError(response.data.message || "Invalid email or password");
          setIsLoading(false); // Stop loading animation
      }
    } catch (err) {
        setError("Please enter correct email address and password.");
        setIsLoading(false); // Stop loading animation
    }
  };

  // POST API request to verify OTP
  const handleOtpSubmit = async () => {
    const otpValue = otp.join('');

    try {
      // Replacing fetch with axios POST request for OTP verification
      const response = await axios.post('http://localhost:8000/api/hrms/verifyLogin', { email, otp: otpValue });

      if (response.status === 200) {
          const { token, username, role, email, fullname } = response.data;

          console.log(response.data);
          

          // Store globally in Redux
          dispatch(login({ token, username: username, role, email, fullname }));

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.username);
          localStorage.setItem("fullname", response.data.fullName);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("email", response.data.email);

          //dispatch(login({ username: response.data.username }));

          //setOpenSnackbar(true);
          router.push("/dashboard");
      } else {
          setOtpError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
        setOtpError("An error occurred. Please try again.");
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

   // Handle OTP input focus and navigation
   const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    if (/^\d$/.test(value) || value === '') { // Accept only digits or empty value
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next field if input is valid
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      // Move to previous field if empty
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleOtpDialogClose = () => {
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);  // Reset OTP values when dialog is closed
    setIsOtpDialogOpen(false);
  };

  // Function to handle Resend OTP
  useEffect(() => {
    let countdown;
    if (isOtpDialogOpen) {
      setTimer(30); // Reset timer when dialog opens
      setIsResendDisabled(true); // Disable the resend button
  
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setIsResendDisabled(false); // Enable the resend button when timer reaches 0
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown); // Cleanup on component unmount or dialog close
  }, [isOtpDialogOpen]);
  
  

  const handleResendOtp = async () => {
    if (timer === 0) {
      setOtpError("");  // Clear any existing error
      setIsLoading(true);  // Start loading animation
  
      try {
        // Resend OTP using the login API
        const response = await axios.post('http://localhost:8000/api/hrms/login', { email, password });
  
        if (response.status === 200) {
          setError("");  // Clear error message
          setIsResendDisabled(true); // Disable the button immediately after resending OTP
          setTimer(30); // Restart the timer
          // Start the countdown for the resend button
          let countdown = setInterval(() => {
            setTimer((prevTimer) => {
              if (prevTimer <= 1) {
                clearInterval(countdown);
                setIsResendDisabled(false); // Enable the button after the timer reaches 0
                return 0;
              }
              return prevTimer - 1;
            });
          }, 1000);
        } else {
          setError(response.data.message || "Failed to resend OTP");
        }
      } catch (err) {
        setError("Error resending OTP. Please try again.");
      } finally {
        setIsLoading(false);  // Stop loading animation
      }
    }
  };
  

// const maskEmail = (email) => {
//   const [name, domain] = email.split("@");
//   const maskedName = name.length > 4
//     ? name.substring(0, 4) + "*".repeat(name.length - 8) + name.substring(name.length - 4)
//     : name;
//   return `${maskedName}@${domain}`;
// };
  const maskEmail = (email) => {
    // Example of checking for negative count before repeating
    const maskCount = Math.max(0, email.length -8);  // Ensure count is not negative
    return email.slice(0, 3) + '*'.repeat(maskCount) + email.slice(-12);
  };


  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', // For layering
    overflow: 'hidden',
    }}>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: isOtpDialogOpen ? 'blur(5px)' : 'none', // Apply blur when OTP dialog is open
          transition: 'filter 0.3s ease', // Smooth transition effect
        }}
      >
        <Paper sx={{
          height: 'auto',
          width: '50vh',
          backgroundColor: 'white',
          padding: '50px',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
          <img src="logo.webp" alt="Logo" style={{ marginBottom: '20px', width: '80px', height: 'auto' }} />

          <Typography variant="h5" sx={{ marginBottom: '15px', fontWeight: 'bold' }}>
            Sign in to your account
          </Typography>

          <Box sx={{
            color: '#F34040',
            backgroundColor: '#FBDBDB',
            borderRadius: '10px',
            padding: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            height: error ? 'auto' : '0px',
            minHeight: '40px',
            visibility: error ? 'visible' : 'hidden',
            opacity: error ? 1 : 0,
            transition: 'visibility 0s, opacity 0.3s ease',
            marginBottom: '10px',
          }}>
            <ErrorOutlineIcon color="error" sx={{ marginRight: 1 }} />
            <Typography color="error" variant="body2" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                marginBottom: '15px',
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
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'black' }}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              sx={{
                marginBottom: '15px',
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

            <Typography
              variant="body2"
              color="primary"
              sx={{
                marginTop: '10px',
                marginBottom: '10px',
                color: 'black',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </Typography>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                padding: '8px 10px',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  backgroundColor: isLoading ? 'black' : '#333',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'black',
                  color: 'white',
                  opacity: 0.8,
                },
                '@keyframes loadingDots': {
                  '0%': { opacity: 0.2 },
                  '20%': { opacity: 1 },
                  '100%': { opacity: 0.2 },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isLoading ? (
                  <>
                    Signing in
                    <Box
                      sx={{
                        display: 'inline-flex',
                        marginLeft: '8px',
                        '& .dot': {
                          width: '4px',
                          height: '4px',
                          margin: '0 2px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          display: 'inline-block',
                          animation: 'loadingDots 1.4s infinite',
                          '&:nth-of-type(2)': {
                            animationDelay: '0.2s',
                          },
                          '&:nth-of-type(3)': {
                            animationDelay: '0.4s',
                          },
                        },
                      }}
                    >
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </Box>
                  </>
                ) : (
                  'Sign in'
                )}
              </Box>
            </Button>

          </form>
        </Paper>
      </Box>

      {/* OTP Dialog */}
      <Dialog open={isOtpDialogOpen} onClose={handleOtpDialogClose}>
        <DialogTitle>
          <IconButton
            onClick={handleOtpDialogClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'black',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '150px',
              width: '350px',
              justifyContent: 'flex-start',
            }}
          >
            <Box sx={{ marginBottom: '12px', width: '100%', textAlign: 'left' }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '.9 rem',
                  color: '#3a3939',
                  fontWeight: '600',
                  marginLeft: '10px',
                }}
              >
                <span style={{ color: '#e93838', fontSize: "1.5rem", position: 'relative', top: '8px' }}>*</span> OTP is sent to your registered Email :- 
                <span style={{ color: '#303030', fontWeight: '500', fontSize: "1rem", marginLeft: "18px" }}>
                  {maskEmail(email)}
                </span>
              </Typography>
            </Box>

            <Box
              sx={{
                height: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {otpError && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    width: '150px',
                    paddingBottom: '3px',
                    fontSize: "14px",
                    fontWeight: "500",
                    marginTop: "9px"
                  }}
                >
                  {otpError}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {otp.map((digit, index) => (
                <TextField
                  className="otp_input"
                  key={index}
                  id={`otp-input-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  variant="outlined"
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center' },
                  }}
                  sx={{
                    width: '40px',
                    marginRight: '5px',
                    marginTop: "30px",
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '6px',
                      borderColor: 'red',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused': {
                      borderColor: 'black',
                    },
                    '&:hover .MuiOutlinedInput-root': {
                      borderColor: 'black',
                    },
                    '& .MuiInputBase-input': {
                      height: '40px',
                      padding: '0',
                      textAlign: 'center',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
  {isResendDisabled && (
    <Typography sx={{ marginRight: 'auto', fontSize: '14px', color: 'gray' }}>
      Resend OTP in {timer}s
    </Typography>
  )}
  <Button
    onClick={handleResendOtp}
    disabled={isResendDisabled}
    sx={{
      backgroundColor: isResendDisabled ? '#f7f7f7' : 'black',
      color: 'white',
      fontSize: '12px',
      padding: '5px 10px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: isResendDisabled ? 'gray' : '#333',
      },
    }}
  >
    Resend OTP
  </Button>
  <Button
    onClick={handleOtpSubmit}
    sx={{
      backgroundColor: 'black',
      color: 'white',
      fontSize: '12px',
      padding: '5px 10px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: '#333',
      },
    }}
  >
    Verify
  </Button>
</DialogActions>


      </Dialog>
    </Box>
  );
};

export default Login;