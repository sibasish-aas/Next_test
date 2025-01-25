"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setErrors, saveJobNotice, resetFormData } from "../../redux/slices/noticeSlice";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Box,
} from "@mui/material";

export default function CreateNotice() {
  const dispatch = useDispatch();
  const { formData, errors } = useSelector((state) => state.notices);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFormData({ [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    if (!formData.jobTitle) {
      newErrors.jobTitle = "Job Title is required.";
      formIsValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required.";
      formIsValid = false;
    }

    if (!formData.publishDate) {
      newErrors.publishDate = "Publish Date is required.";
      formIsValid = false;
    }

    if (!formData.expiryDate || formData.expiryDate <= formData.publishDate) {
      newErrors.expiryDate =
        formData.expiryDate <= formData.publishDate
          ? "Expire Date must be later than Publish Date."
          : "Expire Date is required.";
      formIsValid = false;
    }

    if (!formData.jobCategory) {
      newErrors.jobCategory = "Job Category is required.";
      formIsValid = false;
    }

    if (!formData.noOfPositions || formData.noOfPositions <= 0) {
      newErrors.noOfPositions = "Number of Positions must be greater than 0.";
      formIsValid = false;
    }

    dispatch(setErrors(newErrors));
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await dispatch(saveJobNotice(formData)).unwrap();
      alert("Job created successfully!");
      dispatch(setFormData({ id: response.id }));
      dispatch(resetFormData());
    } catch (error) {
      alert(error || "An error occurred while submitting the form.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 900, // Increased width of the card further
          width: "100%",
          padding: 4,
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3, // Space between form fields
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ color: "black" }}
        >
          Job Notice Form
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ display: "grid", gap: 3 }}>
            {[{
              label: "Title",
              name: "jobTitle",
              type: "text",
              value: formData.jobTitle,
              error: errors.jobTitle,
              helperText: errors.jobTitle,
            },
            {
              label: "Description",
              name: "description",
              type: "text",
              value: formData.description,
              multiline: true,
              rows: 4,
              error: errors.description,
              helperText: errors.description,
            }].map((field, index) => (
              <Box key={index} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="subtitle1" gutterBottom>
                  {field.label}
                </Typography>
                <TextField
                  fullWidth
                  name={field.name}
                  type={field.type}
                  value={field.value}
                  onChange={handleInputChange}
                  multiline={field.multiline}
                  rows={field.rows}
                  error={!!field.error}
                  helperText={field.helperText}
                />
              </Box>
            ))}

            {/* Job Category and Number of Positions in one row */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Job Category
                </Typography>
                <FormControl fullWidth error={!!errors.jobCategory}>
                  <Select
                    value={formData.jobCategory}
                    onChange={handleInputChange}
                    name="jobCategory"
                  >
                    <MenuItem value="">Select Job Category</MenuItem>
                    <MenuItem value="Intern">Intern</MenuItem>
                    <MenuItem value="Full-Time">Full-Time</MenuItem>
                    <MenuItem value="Flexible">Flexible</MenuItem>
                    <MenuItem value="Part-Time">Part-Time</MenuItem>
                  </Select>
                  {errors.jobCategory && (
                    <Typography color="error" variant="caption">
                      {errors.jobCategory}
                    </Typography>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Number of Positions
                </Typography>
                <TextField
                  fullWidth
                  name="noOfPositions"
                  type="number"
                  value={formData.noOfPositions}
                  onChange={handleInputChange}
                  error={!!errors.noOfPositions}
                  helperText={errors.noOfPositions}
                />
              </Box>
            </Box>
            {/* Publish Date and Expiry Date in one row */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Publish Date
                </Typography>
                <TextField
                  fullWidth
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={handleInputChange}
                  error={!!errors.publishDate}
                  helperText={errors.publishDate}
                />
              </Box>

              <Box sx={{ width: "48%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Expiry Date
                </Typography>
                <TextField
                  fullWidth
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Box>
            </Box>

          
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              padding: "10px 0",
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333333",
                color: "#f0f0f0",
              },
              marginTop: 3,  // Spacing above the button
            }}
          >
            Create Job Notice
          </Button>
        </form>
      </Box>
    </Box>
  );
}
