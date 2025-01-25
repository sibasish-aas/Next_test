// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Card,
//   CardContent,
//   Grid,
// } from "@mui/material";
// import axios from "axios";
// import WorkIcon from "@mui/icons-material/Work";
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
// import { motion } from "framer-motion";
// import { styled } from "@mui/material/styles";
// import { useDispatch, useSelector } from 'react-redux';
// import { 
//   fetchNotices, 
//   updateNoticeStatus, 
//   setSelectedNotice,
//   clearSelectedNotice
// } from '../../redux/slices/noticeSlice';

// // Styled components for animation
// const AnimatedCard = styled(motion.div)`
//   width: 100%;
//   height: 100%;
// `;

// const StyledDialog = styled(Dialog)`
//   .MuiDialog-paper {
//     background: linear-gradient(145deg, #ffffff, #f6f7f9);
//     backdrop-filter: blur(10px);
//   }
// `;

// // Animation variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const cardVariants = {
//   hidden: {
//     opacity: 0,
//     y: 20,
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   },
// };

// export default function ViewNoticeRequest() {
//   const dispatch = useDispatch();
//   const { items: jobNotices, loading, selectedNotice } = useSelector(state => state.notices);
//   const [openModal, setOpenModal] = useState(false);
//   const [feedback, setFeedback] = useState("");
//   const [dialogLoading, setDialogLoading] = useState(false);

//   useEffect(() => {
//     dispatch(fetchNotices());
//   }, [dispatch]);

//   const handleOpenModal = async (id) => {
//     try {
//       setDialogLoading(true);
//       const notice = jobNotices.find(n => n.jobNoticeId === id);
//       if (notice) {
//         dispatch(setSelectedNotice(notice));
//         setOpenModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching notice details:', error);
//       alert('Failed to load notice details.');
//     } finally {
//       setDialogLoading(false);
//     }
//   };

//   const handleAccept = async () => {
//     if (!selectedNotice || !feedback) return;

//     try {
//       await dispatch(updateNoticeStatus({
//         id: selectedNotice.jobNoticeId,
//         statusData: {
//           f_id: selectedNotice.jobNoticeId,
//           feedback,
//           status: 'Approved'
//         }
//       })).unwrap();

//       handleCloseModal();
//       dispatch(fetchNotices()); // Refresh the list
//     } catch (error) {
//       console.error('Error updating notice:', error);
//       alert('Failed to approve the notice.');
//     }
//   };

//   const handleReject = async () => {
//     if (!selectedNotice || !feedback) return;

//     try {
//       await dispatch(updateNoticeStatus({
//         id: selectedNotice.jobNoticeId,
//         statusData: {
//           f_id: selectedNotice.jobNoticeId,
//           feedback,
//           status: 'Rejected'
//         }
//       })).unwrap();

//       handleCloseModal();
//       dispatch(fetchNotices()); // Refresh the list
//     } catch (error) {
//       console.error('Error updating notice:', error);
//       alert('Failed to reject the notice.');
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     dispatch(clearSelectedNotice());
//     setFeedback("");
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f5f5f5",
//         padding: 2,
//         marginTop: 4,
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: 1400, // Increased width
//           width: "100%",
//           padding: 4,
//           backgroundColor: "#fff",
//           boxShadow: 3,
//           borderRadius: 2,
//         }}
//       >
//         <Typography
//           variant="h4"
//           gutterBottom
//           textAlign="center"
//           sx={{ color: "black", fontWeight: "bold" }}
//         >
//           Job Notice Requests
//         </Typography>

//         {loading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             height="200px"
//           >
//             <CircularProgress />
//           </Box>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="job notices table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="left" sx={{ fontWeight: "bold" }}>
//                     Job Notice ID
//                   </TableCell>
//                   <TableCell align="left" sx={{ fontWeight: "bold" }}>
//                     Job Title
//                   </TableCell>
//                   <TableCell align="left" sx={{ fontWeight: "bold" }}>
//                     Publish Date
//                   </TableCell>
//                   <TableCell align="left" sx={{ fontWeight: "bold" }}>
//                     Status
//                   </TableCell>
//                   <TableCell align="center" sx={{ fontWeight: "bold" }}>
//                     View
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {jobNotices.length > 0 ? (
//                   jobNotices.map((job) => (
//                     <TableRow key={job.jobNoticeId}>
//                       <TableCell align="left">{job.jobNoticeId}</TableCell>
//                       <TableCell align="left">{job.jobTitle}</TableCell>
//                       <TableCell align="left">{job.publishDate}</TableCell>
//                       <TableCell align="left">{job.status}</TableCell>
//                       <TableCell align="center">
//                         <Button
//                           variant="contained"
//                           color="black"
//                           onClick={() => handleOpenModal(job.jobNoticeId)}
//                           sx={{
//                             transition: "transform 0.3s ease",
//                             "&:hover": {
//                               transform: "scale(1.1)",
//                               backgroundColor: "#333", // Black button color on hover
//                             },
//                           }}
//                         >
//                           View
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center">
//                       No job notices found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//             <hr style={{ border: "1px solid #ddd", marginTop: "20px" }} />{" "}
//             {/* Horizontal line */}
//           </TableContainer>
//         )}

//         {/* Modal to show job details and feedback */}
//         <StyledDialog
//           open={openModal}
//           onClose={handleCloseModal}
//           maxWidth={false}
//           fullWidth
//           TransitionProps={{
//             timeout: 400,
//           }}
//           PaperProps={{
//             sx: {
//               width: "80vw",
//               height: "85vh",
//               maxWidth: "none",
//               m: 2,
//               overflow: "hidden",
//               boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//               border: "1px solid rgba(255,255,255,0.2)",
//             },
//           }}
//         >
//           <DialogTitle
//             component={motion.div}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4 }}
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               borderBottom: "1px solid rgba(0,0,0,0.1)",
//               background: "rgba(255,255,255,0.9)",
//               backdropFilter: "blur(10px)",
//               position: "sticky",
//               top: 0,
//               zIndex: 1,
//               px: 4,
//               py: 2,
//             }}
//           >
//             <Typography variant="h5" fontWeight="bold">
//               Job Notice Details
//             </Typography>
//             <Button
//               onClick={handleCloseModal}
//               color="secondary"
//               sx={{
//                 borderRadius: "50%",
//                 minWidth: "40px",
//                 width: "40px",
//                 height: "40px",
//                 "&:hover": {
//                   backgroundColor: "rgba(0,0,0,0.04)",
//                 },
//               }}
//             >
//               ✕
//             </Button>
//           </DialogTitle>

//           <DialogContent
//             component={motion.div}
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             sx={{
//               p: 4,
//               overflowY: "auto",
//               "&::-webkit-scrollbar": {
//                 width: "8px",
//               },
//               "&::-webkit-scrollbar-track": {
//                 background: "transparent",
//               },
//               "&::-webkit-scrollbar-thumb": {
//                 background: "rgba(0,0,0,0.1)",
//                 borderRadius: "4px",
//               },
//             }}
//           >
//             {dialogLoading ? (
//               <Box
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 height="200px"
//               >
//                 <CircularProgress />
//               </Box>
//             ) : selectedNotice ? (
//               <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
//                 {/* Left Column */}
//                 <Box
//                   component={motion.div}
//                   variants={cardVariants}
//                   sx={{
//                     width: "35%",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 3,
//                   }}
//                 >
//                   {/* Job Details Card */}
//                   <Card
//                     component={motion.div}
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     sx={{
//                       boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//                       borderRadius: 2,
//                       background: "rgba(255,255,255,0.95)",
//                       border: "1px solid rgba(0,0,0,0.05)",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <CardContent sx={{ p: 3 }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         Job Details
//                       </Typography>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: 2.5,
//                         }}
//                       >
//                         {/* Job Title Row */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 2,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               width: "40%",
//                               gap: 1,
//                             }}
//                           >
//                             <WorkIcon sx={{ color: "black" }} />
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               Job Title:
//                             </Typography>
//                           </Box>
//                           <Typography variant="body1">
//                             {selectedNotice.jobTitle || "N/A"}
//                           </Typography>
//                         </Box>

//                         {/* Publish Date Row */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 2,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               width: "40%",
//                               gap: 1,
//                             }}
//                           >
//                             <CalendarTodayIcon sx={{ color: "black" }} />
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               Publish Date:
//                             </Typography>
//                           </Box>
//                           <Typography variant="body1">
//                             {selectedNotice.publishDate || "N/A"}
//                           </Typography>
//                         </Box>

//                         {/* Status Row */}
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 2,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               width: "40%",
//                               gap: 1,
//                             }}
//                           >
//                             <AssignmentTurnedInIcon sx={{ color: "black" }} />
//                             <Typography variant="subtitle1" fontWeight="bold">
//                               Status:
//                             </Typography>
//                           </Box>
//                           <Typography variant="body1">
//                             {selectedNotice.status || "N/A"}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </CardContent>
//                   </Card>

//                   {/* Feedback Section Card */}
//                   <Card
//                     component={motion.div}
//                     whileHover={{ scale: 1.01 }}
//                     transition={{ type: "spring", stiffness: 300 }}
//                     sx={{
//                       boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//                       borderRadius: 2,
//                       background: "rgba(255,255,255,0.95)",
//                       border: "1px solid rgba(0,0,0,0.05)",
//                     }}
//                   >
//                     <CardContent sx={{ p: 3 }}>
//                       <Typography variant="h6" gutterBottom fontWeight="bold">
//                         Feedback Section
//                       </Typography>
//                       <TextField
//                         label="Provide your feedback"
//                         fullWidth
//                         multiline
//                         rows={4}
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                         sx={{
//                           mb: 3,
//                           "& .MuiOutlinedInput-root": {
//                             backgroundColor: "#f8f9fa",
//                           },
//                         }}
//                       />

//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           gap: 2,
//                           mt: 3,
//                         }}
//                       >
//                         <Button
//                           variant="contained"
//                           onClick={handleAccept}
//                           disabled={!feedback}
//                           sx={{
//                             flex: 1,
//                             borderRadius: 2,
//                             textTransform: "none",
//                             py: 1.5,
//                             transition: "all 0.2s",
//                             backgroundColor: "black",
//                             color: "white",
//                             "&:hover": {
//                               backgroundColor: "#333333",
//                               transform: "translateY(-2px)",
//                               boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                             },
//                             "&:disabled": {
//                               backgroundColor: "#cccccc",
//                               color: "#666666",
//                             },
//                           }}
//                         >
//                           Accept
//                         </Button>
//                         <Button
//                           variant="contained"
//                           onClick={handleReject}
//                           disabled={!feedback}
//                           sx={{
//                             flex: 1,
//                             borderRadius: 2,
//                             textTransform: "none",
//                             py: 1.5,
//                             transition: "all 0.2s",
//                             backgroundColor: "black",
//                             color: "white",
//                             "&:hover": {
//                               backgroundColor: "#333333",
//                               transform: "translateY(-2px)",
//                               boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
//                             },
//                             "&:disabled": {
//                               backgroundColor: "#cccccc",
//                               color: "#666666",
//                             },
//                           }}
//                         >
//                           Reject
//                         </Button>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Box>

//                 {/* Right Column - Description */}
//                 <Card
//                   component={motion.div}
//                   variants={cardVariants}
//                   whileHover={{ scale: 1.005 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                   sx={{
//                     flex: 1,
//                     boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//                     borderRadius: 2,
//                     background: "rgba(255,255,255,0.95)",
//                     border: "1px solid rgba(0,0,0,0.05)",
//                     alignSelf: "flex-start",
//                   }}
//                 >
//                   <CardContent sx={{ p: 3 }}>
//                     <Typography variant="h6" gutterBottom fontWeight="bold">
//                       Job Description
//                     </Typography>
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         mt: 2,
//                         padding: "15px",
//                         backgroundColor: "#f8f9fa",
//                         borderRadius: "8px",
//                         whiteSpace: "pre-wrap",
//                       }}
//                     >
//                       {selectedNotice.description || "No description available"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ) : (
//               <Typography variant="body1">No details available.</Typography>
//             )}
//           </DialogContent>
//         </StyledDialog>
//       </Box>
//     </Box>
//   );
// }
