

"use client";

import React, { useEffect } from 'react';
import { Box, Grid, Typography, Card, CardContent, Tooltip } from "@mui/material";
import { LinearProgress } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VacationIcon from "@mui/icons-material/BeachAccess";
import WorkIcon from "@mui/icons-material/Work";

import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; 
import AccessTimeIcon from "@mui/icons-material/AccessTime"; 
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";


import { useDispatch, useSelector } from 'react-redux';
import {getavailableleaves } from '../../redux/slices/LeaveSlice';


// Icons for Leave Types
const leaveIcons = {
  Medical: <MedicalServicesIcon fontSize="large" />,  // Medical Leave
  Sick: <LocalHospitalIcon fontSize="large" />,  // Sick Leave
  Casual: <WorkIcon fontSize="large" />,  // Casual Leave
  Paid: <VacationIcon fontSize="large" />,  // Paid Leave
  Paternal: <FamilyRestroomIcon fontSize="large" />,  // Paternal Leave
  Compensatory: <AssignmentLateIcon fontSize="large" />,  // Compensatory Leave
  Maternal: <PregnantWomanIcon fontSize="large" />,  // Maternal Leave
  Unpaid: <AccessTimeIcon fontSize="large" />,  // Unpaid Leave
};


const LeaveStatusCard = ({ availableLeaves }) => {
  return (
    <Card sx={{borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: 2, width: "100%", height: "100%" }}>
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 2 }}>
        <strong> Available Leaves</strong>
      </Typography>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", width: "100%" }}>
      {availableLeaves && availableLeaves.available_leaves && Object.keys(availableLeaves.available_leaves).map((leaveType, index) => {
        const leaveData = availableLeaves.available_leaves[leaveType];

        // Calculate the percentage of used leaves
        const percentage = (leaveData.used_leaves / leaveData.total_leaves) * 100;

        // Get the corresponding icon for each leave type
        const leaveIcon = leaveIcons[leaveType.charAt(0).toUpperCase() + leaveType.slice(1)] || null;

        return (
          <Box key={index} sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on medium and above
            padding: 1,
            borderRadius: 1,
            boxShadow: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)", 
          }}>

            {/* Left Section with Icon and Type */}
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "33%",
              textAlign: "center",
            }}>
              {leaveIcon && <Box sx={{ marginRight: 2 }}>{leaveIcon}</Box>}
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                {leaveType.charAt(0).toUpperCase() + leaveType.slice(1)}
              </Typography>
            </Box>

            {/* Center Section with Progress Bar */}
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "33%",
              position: "relative", // For positioning the sticky point
            }}>

              {/* Progress Bar with Tooltip */}
              <Tooltip title={`${Math.round(percentage)}%`} placement="top" arrow>
                <Box sx={{
                  width: "80%",  // Width of the progress bar container
                  position: "relative",
                  cursor: "pointer"
                }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      width: "100%", // Fill the container width
                      height: 8,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>

            {/* Right Section with Used/Total Leave */}
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              width: "33%",
            }}>
              <Typography variant="body2" color="text.secondary">
                {`${leaveData.used_leaves} / ${leaveData.total_leaves}`}
              </Typography>
            </Box>

          </Box>
        );
      })}
    </CardContent>
    </Card>
  );
};

const LeaveStatusDisplay = ({employeeid}) => {
  const dispatch = useDispatch();
const employeeId=employeeid;
   // Access the status and error from the Redux state
   const leaveStatus = useSelector(state => state.leave.status);
   const error = useSelector(state => state.leave.error);
   const availableLeaves = useSelector(state => state.leave.EmployeeAvialableLeave);
   useEffect(() => {
    if (employeeId) {
      dispatch(getavailableleaves(employeeId));  // Pass employeeId to the action
    }
  }, [dispatch, employeeId]);  // Re-run effect if employeeId changes

// Log the response data or error when the status changes
// useEffect(() => {
//   if (leaveStatus === 'succeeded') {
//     console.log('Available Leaves:', availableLeaves );
//   } else if (leaveStatus === 'failed') {
//     console.log('Error:', error);
//   }
// }, [availableLeaves, leaveStatus, error]);


  return (
    <Box sx={{ padding: 0, width: "100%", height: "100%" }}>
    {/* <h1>Employee Id is : {employeeid}</h1> */}
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <LeaveStatusCard availableLeaves={availableLeaves} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaveStatusDisplay;




