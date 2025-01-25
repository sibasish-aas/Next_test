'use client';
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  Pagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import  {useRouter}  from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchCandidates } from "../../redux/slices/selectedCandidateSlice";


const SelectedCandidates = () => {
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector((state) => state.candidates);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("none");

  const candidatesPerPage = 10;
   const router = useRouter();

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const safeCandidates = Array.isArray(candidates) ? candidates : [];

  const filteredCandidates = safeCandidates.filter((candidate) =>
    candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCandidates =
    sortField === "none"
      ? filteredCandidates
      : [...filteredCandidates].sort((a, b) => {
          const fieldA = (a[sortField] || '').toString().toLowerCase();
          const fieldB = (b[sortField] || '').toString().toLowerCase();
          return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
        });

  const currentCandidates = sortedCandidates.slice(
    (page - 1) * candidatesPerPage,
    page * candidatesPerPage
  );

  //console.log(candidates);

  // if (candidates) {
  //   console.log('Redirecting to:', {
  //     pathname: "/offerletter",
  //     query: {
  //       applicantId:5,
  //       mail: 'it_pujarini@outlook.com',
  //       role: 'Software Engineer',
  //     },
  //   });
  // }

  
  const navigateToOfferLetter = (candidate) => {
    //router.push(`/offer-letter/${candidate.applicantId}${encodeURIComponent(candidate.candidateEmail)}/${encodeURIComponent(candidate.role)}`);
    router.push(`/offer-letter?applicantId=${candidate.applicantId}&mail=${encodeURIComponent(candidate.candidateEmail)}&role=${encodeURIComponent(candidate.role)}`);
  };
  
  if (loading) {
    return <Typography variant="h6" textAlign="center">Loading...</Typography>;
  }
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return <Typography variant="h6" textAlign="center">No candidates found.</Typography>;
  }
  if (error) {
    return <Typography variant="h6" color="error" textAlign="center">{error}</Typography>;
  }
  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
    <Typography
      variant="h4"
      gutterBottom
      textAlign="center"
      sx={{ color: "#2c3e50", fontWeight: "bold", marginBottom: "30px" }}
    >
      Selected Candidates
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
      <TextField
        label="Search by Name, Contact or Role"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ maxWidth: "400px", width: "100%" }}
      />
      <FormControl sx={{ minWidth: 150, maxWidth: "200px", width: "100%" }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortField} onChange={handleSortFieldChange} label="Sort by" fullWidth>
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="contact">Contact</MenuItem>
          <MenuItem value="role">Role</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Box
      sx={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: 5,
      }}
    >
      <Grid container sx={{ backgroundColor: "#34495e", color: "#ecf0f1", padding: "12px 16px", fontWeight: "bold" }}>
        <Grid item xs={1}>SL No.</Grid>
        <Grid item xs={3}>Candidate Name</Grid>
        <Grid item xs={3}>Contact Number</Grid>
        <Grid item xs={2}>Role</Grid>
        <Grid item xs={3}>Action</Grid>
      </Grid>

      {currentCandidates.map((candidate, index) => (
        <Grid
          container
          key={candidate.applicantId}
          sx={{
            "&:nth-of-type(odd)": { backgroundColor: "#ecf0f1" },
            padding: "12px 16px",
            "&:hover": { backgroundColor: "#bdc3c7" },
          }}
        >
          <Grid item xs={1}>{index + 1}</Grid>
          <Grid item xs={3}>{candidate.fullName}</Grid>
          <Grid item xs={3}>{candidate.candidateEmail}</Grid>
          <Grid item xs={2}>{candidate.role}</Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
                padding: "10px 20px",
                fontWeight: "bold",
              }}
              onClick={() => navigateToOfferLetter(candidate)}
            >
              Generate Offer Letter
            </Button>
          </Grid>
        </Grid>
      ))}
    </Box>

    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <Pagination
        count={Math.ceil(sortedCandidates.length / candidatesPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
      />
    </Box>
  </div>
  )
}

export default SelectedCandidates;