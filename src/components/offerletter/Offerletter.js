'use client';
import {saveOfferLetter} from '../../redux/slices/offerletterSlice';
import React, { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
 // Import Redux action
import axios from "axios"; // Ensure axios is imported

const Offerletter = () => {
    const searchParams = useSearchParams();
    const offerLetterRef = useRef();
  
    const applicantId = searchParams.get('applicantId');
    const mail = searchParams.get('mail');
    const role = searchParams.get('role');
  
    const [fields, setFields] = useState({
      applicantId: applicantId || "",
      mail: mail || "",
      name: "CANDIDATE NAME",
      address: "ADDRESS WITH PINCODE",
      date: "",
      role: role || "",
      salary: "Stipend Details",
      duration: "Duration Details",
      startdate: "Start Date Details",
    });
  
    useEffect(() => {
      if (applicantId && mail && role) {
        setFields((prevFields) => ({
          ...prevFields,
          applicantId,
          mail,
          role,
        }));
      }
    }, [applicantId, mail, role]);
  
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.offerLetter);
  
    const handleFieldChange = (field, value) => {
      setFields((prev) => ({ ...prev, [field]: value }));
    };
  
   
  
    const saveAndSendOfferLetter = async () => {
      const dataToSave = { ...fields };
    
      try {
        // Save offer letter to the backend
        const saveResponse = await dispatch(saveOfferLetter(dataToSave)).unwrap();
        console.log("Offer letter saved successfully:", saveResponse);
        alert("Offer letter saved successfully!");
    
        // Proceed with sending the offer letter email only if save was successful
        if (saveResponse) {
        
          const finalID = fields.applicantId;
          console.log("finalID", finalID);
          
          const emailEndpoint = `http://localhost:8000/api/hrms/sendgreetingemail/${finalID}`;
         
    
          const emailData = {
            applicantId: fields.applicantId,
            // You can include more data here if needed
          };
    
          // Example of setting the token
         
  
          // Function to get the token from local storage
          const getAuthToken = () => {
            if (typeof window !== 'undefined') {
              return localStorage.getItem('token');
            }
            return null;
          };
  
          // Function to set the Authorization headers
          const setAuthHeaders = () => {
            const token = getAuthToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          };
  
          const headers = setAuthHeaders();
  
    
          try {
            // Send the offer letter email
            const emailResponse = await axios.post(emailEndpoint, emailData, { headers });
  
            console.log("Email response:", emailResponse);
    
            // if (emailResponse.data && emailResponse.data.success) {
            //   alert("Email sent successfully!");
            // } else {
            //   // Email API failed, but we still want to inform the user
            //   throw new Error(emailResponse.data.message || "Failed to send email");
            // }
          } catch (emailError) {
            // Specific error handling for email sending
            alert("Email sending error: " + (emailError.response?.data?.message || emailError.message || "Unknown error"));
          }
        } else {
          throw new Error("Failed to save offer letter");
        }
      } catch (error) {
        // General error handling
        alert("Error: " + (error.response?.data?.message || error.message || "Unknown error"));
      }
    };
    
    useEffect(() => {
      if (error) {
        alert("Error: " + error);
      }
    }, [error]);
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <Box
        ref={offerLetterRef}
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#F5F5DC",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: 5,
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Logo Section */}
        <Box textAlign="center" marginBottom="20px">
          <img
            src="/AAS_Int-removebg-preview.png"
            alt="Company Logo"
            style={{ width: "100px", height: "auto", marginBottom: "10px",marginLeft:"340px" }}
          />
          <h2 style={{ margin: 0, color: "#b28c02", fontSize: "27px" }}>
            AAS International Private Limited
          </h2>
          <p style={{ fontStyle: "italic", margin: 0, color: "#6a6a6a", fontSize: "18px" }}>
            Our Quality is Your Success
          </p>
          <hr style={{ border: "1px solid #998100", marginTop: "10px" }} />
          <hr style={{ border: "1px solid #998100", marginTop: "10px" }} />
        </Box>

        <Box>
          <p style={{ margin: "0", lineHeight: "1.5" }}>
            AAS International Private Limited
            <br />
            Plot No. 52 Bapuji Nagar Unit - 1 Main Street, Forest Park
            <br />
            Bhubaneswar Khorda - Odisha, 751009
          </p>
          <div style={{ marginTop: "10px" }}>
            <b>Date:</b>{" "}
            <TextField
              variant="standard"
              value={fields.date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
              style={{ width: "100px" }}
            />
          </div>
        </Box>

        <Box>
          <p style={{ margin: "0", lineHeight: "1.5" }}>
            To,
            </p>
            <br />
           
              <TextField
                variant="standard"
                fullWidth
                value={fields.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            
            <span>
              <TextField
                variant="standard"
                fullWidth
                value={fields.address}
                onChange={(e) => handleFieldChange("address", e.target.value)}
              />
            </span>
          
        </Box>

        <Box marginTop="20px">
          <h4>Subject: Internship/Full Time Offer For : {fields.role}</h4>
        </Box>

        {/* Body Section */}
        <Box>
          <p style={{ lineHeight: "1.5", textAlign: "justify" }}>
            Dear <b>{fields.name}</b>,
          </p>
          <p style={{ lineHeight: "1.5", textAlign: "justify" }}>
            We are excited to offer you an internship opportunity with{" "}
            <b>AAS International Private Limited</b> for the position of{" "}
            <b>{fields.role}</b>. This is a platform to gain practical
            experience, develop your skills, and grow in the professional
            environment we foster.
          </p>
        </Box>

        {/* Role Details */}
        <Box marginTop="20px">
          <h4>Role Details</h4>
          <ul style={{ lineHeight: "1.8" }}>
            <li>
              <b>Position:</b> {fields.role}
            </li>
            <li>
              <b>Duration:</b>{" "}
              <TextField
                variant="standard"
                value={fields.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
              />
            </li>
            <li>
              <b>Location:</b> AAS International Private Limited, Plot No. 52
              Bapuji Nagar Unit - 1 Main Street, Forest Park, Bhubaneswar Khorda
              - Odisha, 751009
            </li>
            <li>
              <b>Stipend/Salary:</b>{" "}
              <TextField
                variant="standard"
                value={fields.salary}
                onChange={(e) => handleFieldChange("salary", e.target.value)}
              />
            </li>
            <li>
              <b>Working Hours:</b> 10:00 AM - 07:00 PM, Monday to Saturday
            </li>
            <li>
              <b>Start Date:</b>{" "}
              <TextField
                variant="standard"
                value={fields.startdate}
                onChange={(e) => handleFieldChange("startdate", e.target.value)}
              />
            </li>
          </ul>
        </Box>

        {/* Footer */}
        <Box
          textAlign="center"
          marginTop="20px"
          paddingTop="10px"
          borderTop="1px solid #ccc"
        >
          <p style={{ fontSize: "14px", margin: "5px 0" }}>
            Plot No. 52, Bapuji Nagar, Unit-1, Main Street, Forest Park,
            Bhubaneswar, Khorda, Odisha, India 751009, Phone :- 06742571111 |
            <a href="https://www.aasint.com">www.aasint.com</a>
          </p>
        </Box>
      </Box>

      {/* Buttons */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        maxWidth="800px"
        margin="10px auto"
      >
        <Button
          variant="contained"
          onClick={() => router.back()}
          style={{ backgroundColor: "#6a6a6a", color: "#fff" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={saveAndSendOfferLetter}
          style={{ backgroundColor: "#b28c02", color: "#fff" }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Save & Send"}
        </Button>
      </Box>
    </div>
  )
}

export default Offerletter;