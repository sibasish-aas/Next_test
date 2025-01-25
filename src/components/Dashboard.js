'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Card, CardContent, Divider, Stack, Link } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GroupsIcon from '@mui/icons-material/Groups';
import ComputerIcon from '@mui/icons-material/Computer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { API_CONFIG } from '../api/apiConfig';

const BASE_URL = API_CONFIG.getBaseUrl();

const StatCard = ({ icon, title, value, color, onClick }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 4,
      background: `linear-gradient(45deg, ${color}15, ${color}08)`,
      border: `1px solid ${color}30`,
      transition: 'transform 0.3s ease-in-out',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': {
        transform: onClick ? 'translateY(-5px)' : 'none',
      }
    }}
    onClick={onClick}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconButton sx={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </IconButton>
      <Typography variant="h4" sx={{ fontWeight: 600, color: color }}>
        {value}
      </Typography>
    </Box>
    <Typography variant="subtitle1" sx={{ mt: 2, color: 'text.secondary', fontWeight: 500 }}>
      {title}
    </Typography>
  </Paper>
);

const InfoCard = ({ title, icon, children, color = "#2196F3" }) => (
  <Card sx={{ height: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton sx={{ backgroundColor: `${color}15`, color: color, mr: 2 }}>
          {icon}
        </IconButton>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
);

const AnimatedWelcomeCard = () => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const icons = [
    { icon: <EmojiPeopleIcon sx={{ fontSize: 40 }} />, text: "Welcome" },
    { icon: <GroupsIcon sx={{ fontSize: 40 }} />, text: "Team" },
    { icon: <ComputerIcon sx={{ fontSize: 40 }} />, text: "Work" }
  ];

  const name = localStorage.getItem("fullname");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % icons.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card sx={{ 
      height: '100%', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ 
        height: '100%', 
        position: 'relative', 
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
          Welcome to HRMS
        </Typography>
        <Box sx={{ 
          mb: 3,
          transform: 'scale(1)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}>
          {icons[currentIcon].icon}
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            opacity: 0.9,
            animation: 'fadeIn 0.5s ease-in-out'
          }}
        >
          {icons[currentIcon].text}
        </Typography>
        <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
          Your complete HR management solution
        </Typography>
      </CardContent>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        zIndex: 0
      }} />
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
};

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeJobs: 0,
    completedInterviews: 0,
    newApplications: 0,
    noticeCount: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
    
    // Fetch job count
    const fetchJobCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getJobList`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const activeJobs = response.data.jobs ? response.data.jobs.length : 0;
        setStats(prev => ({ ...prev, activeJobs }));
      } catch (error) {
        console.error('Error fetching job count:', error);
      }
    };

    // Fetch notice count
    const fetchNoticeCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getnoticelist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            page: 1,
            limit: 100 // Get a reasonable number of notices
          }
        });
        
        // Access the nested data array
        const notices = response.data?.data || [];
        const noticeCount = notices.length;
        setStats(prev => ({ ...prev, noticeCount }));
      } catch (error) {
        console.error('Error fetching notice count:', error);
      }
    };

    fetchJobCount();
    fetchNoticeCount();
  }, [router]);

  const handleJobsClick = () => {
    router.push('/manage-job');
  };
  const handleAttendanceClick =()=>{
    router.push('/all-attendance')
  }

  const handleNoticeClick = () => {
    router.push('/notice-status');
  };

  const statCards = [
    {
      icon: <PeopleAltIcon />,
      title: "Total Employees",
      value: stats.totalEmployees,
      color: "#4CAF50",
      onClick: handleAttendanceClick
    },
    {
      icon: <WorkIcon />,
      title: "Active Jobs",
      value: stats.activeJobs,
      color: "#2196F3",
      onClick: handleJobsClick
    },
    {
      icon: <AssignmentTurnedInIcon />,
      title: "Notice Status",
      value: stats.noticeCount,
      color: "#FF9800",
      onClick: handleNoticeClick
    },
    {
      icon: <PersonAddIcon />,
      title: "New Applications",
      value: stats.newApplications,
      color: "#9C27B0"
    }
  ];

  return (
    <>
    <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          <span style={{ fontWeight: 600, fontSize: '2em' }}>Hello, {localStorage.getItem("fullname")},</span>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          <span style={{ fontWeight: 600, fontSize: '1.2em' }}>Welcome to HRMS!</span>
        </Typography>
    </Box>
    <Box sx={{ p: 4, maxWidth: '1400px', margin: '0 auto' }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4, 
          fontWeight: 700,
          background: 'linear-gradient(45deg, #2196F3, #9C27B0)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Animated Welcome Card */}
        <Grid item xs={12} md={4}>
          <AnimatedWelcomeCard />
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <InfoCard title="Recent Activities" icon={<EventNoteIcon />} color="#FF9800">
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="New Job Posted"
                  secondary="Senior Developer position added"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Interview Completed"
                  secondary="3 candidates interviewed today"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon sx={{ color: '#4CAF50' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Notice Updated"
                  secondary="2 new notices published"
                />
              </ListItem>
            </List>
          </InfoCard>
        </Grid>

        {/* HR Insights */}
        <Grid item xs={12} md={4}>
          <InfoCard title="HR Insights" icon={<TrendingUpIcon />} color="#9C27B0">
            <List>
              <ListItem>
                <ListItemIcon>
                  <GroupsIcon sx={{ color: '#9C27B0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Active Recruitment"
                  secondary={`${stats.activeJobs} positions currently open`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AssignmentTurnedInIcon sx={{ color: '#FF9800' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Notice Board"
                  secondary={`${stats.noticeCount} active notices`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: '#2196F3' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Applications"
                  secondary="Review pending applications"
                />
              </ListItem>
            </List>
          </InfoCard>
        </Grid>
      </Grid>
    </Box>
    </>
  );
};

export default Dashboard;
