

'use client'
import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { submitLeaveRequest } from '../../redux/slices/LeaveSlice'; // Import the Redux action

const NewLeaveRequestForm = ({ employeeId,onClose }) => {
  const EmployeeId = employeeId; // Example employee ID, update as necessary
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.leave); // Access leave state from Redux store

  const [formData, setFormData] = useState({
    Employee: EmployeeId,
    LeaveTitle:"",
    LeaveType:"",
    LeaveStartDate: "",
    LeaveEndDate: "",
    FromShift: "",
    ToShift: "",
    Description: "",
    Attachment: null,
  });

  const [errors, setErrors] = useState({
    LeaveTitle: false,
    LeaveType: false,
    LeaveStartDate: false,
    LeaveEndDate: false,
    FromShift: false,
    ToShift: false,
    Description: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      Attachment: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formIsValid = true;
    let newErrors = { ...errors };

    // Validate fields (except Attachment, which is optional)
    for (let key in formData) {
      if (
        (formData[key] === "" && key !== "Attachment") ||
        (key === "Attachment" && formData.Attachment === null)
      ) {
        newErrors[key] = true;
        formIsValid = false;
      } else {
        newErrors[key] = false;
      }
    }

    setErrors(newErrors);

    if (formIsValid) {
      const token = localStorage.getItem("token"); // Get the token here

      // Check if the token exists
      if (!token) {
        alert("Please login first! Token is missing.");
        return; // Stop the form submission process if the token is missing
      }

      // Dispatch the Redux action to submit the leave request
      try {
        // You might want to adjust the formData format if needed, such as for file attachments.
        
        await dispatch(submitLeaveRequest(formData));


        // Reset form after successful submission
        handleCancel();
        onClose();
      } catch (error) {
        console.error("Error submitting leave request:", error);
        alert("An error occurred while submitting the leave request.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      Employee: EmployeeId,
      LeaveTitle: "",
      LeaveType: "",
      LeaveStartDate: "",
      LeaveEndDate: "",
      FromShift: "",
      ToShift: "",
      Description: "",
      Attachment: null,
    });
    setErrors({
      LeaveTitle: false,
      LeaveType: false,
      LeaveStartDate: false,
      LeaveEndDate: false,
      FromShift: false,
      ToShift: false,
      Description: false,
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12}> {/* Adjusted grid to use full width */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: 1,
              boxShadow: 2,
              padding: 3,
              bgcolor: "#fff",
              height: "100%",
            }}
          >
            <TextField
              label="Employee ID"
              name="Employee"
              value={formData.Employee}
              onChange={handleChange}
              error={errors.Employee}
              helperText={errors.Employee && "Employee ID is required"}
              fullWidth
              required
              disabled
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Title"
                  name="LeaveTitle"
                  value={formData.LeaveTitle}
                  onChange={handleChange}
                  error={errors.LeaveTitle}
                  helperText={errors.LeaveTitle && "Title is required"}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth error={errors.LeaveType} required>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    label="Leave Type"
                    name="LeaveType"
                    value={formData.LeaveType}
                    onChange={handleChange}
                  >
                    <MenuItem value="casual">Casual</MenuItem>
                    <MenuItem value="sick">Sick</MenuItem>
                    <MenuItem value="paid">Emergency</MenuItem>
                    <MenuItem value="paternal">Paternal</MenuItem>
                    <MenuItem value="maternal">Maternal</MenuItem>
                    
                  </Select>
                  {errors.LeaveType && (
                    <FormHelperText>Leave type is required</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  name="LeaveStartDate"
                  type="date"
                  value={formData.LeaveStartDate}
                  onChange={handleChange}
                  error={errors.LeaveStartDate}
                  helperText={errors.LeaveStartDate && "Start date is required"}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  name="LeaveEndDate"
                  type="date"
                  value={formData.LeaveEndDate}
                  onChange={handleChange}
                  error={errors.LeaveEndDate}
                  helperText={errors.LeaveEndDate && "End date is required"}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth error={errors.FromShift} required>
                  <InputLabel>From Shift</InputLabel>
                  <Select
                    label="From Shift"
                    name="FromShift"
                    value={formData.FromShift}
                    onChange={handleChange}
                  >
                    <MenuItem value="1st half">1st Half</MenuItem>
                    <MenuItem value="2nd half">2nd Half</MenuItem>
                    <MenuItem value="Full day">Full Day</MenuItem>
                  </Select>
                  {errors.FromShift && (
                    <FormHelperText>From Shift is required</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth error={errors.ToShift} required>
                  <InputLabel>To Shift</InputLabel>
                  <Select
                    label="To Shift"
                    name="ToShift"
                    value={formData.ToShift}
                    onChange={handleChange}
                  >
                    <MenuItem value="1st half">1st Half</MenuItem>
                    <MenuItem value="2nd half">2nd Half</MenuItem>
                    <MenuItem value="Full day">Full Day</MenuItem>
                  </Select>
                  {errors.ToShift && (
                    <FormHelperText>To Shift is required</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              label="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              error={errors.Description}
              helperText={errors.Description && "Reason is required"}
              fullWidth
              multiline
              rows={4}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  Attach File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="outlined" fullWidth onClick={handleCancel}>
                  Reset
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={status === 'loading'} // Disable submit while loading
                >
                  {status === 'loading' ? 'Submitting...' : 'Submit'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewLeaveRequestForm;
