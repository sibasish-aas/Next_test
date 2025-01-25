"use client";
import React, { useState, useEffect ,useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setCurrentShiftState, markAttendance, setAttendanceHistory } from '../../redux/slices/AddAttendenceSlice';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  InputLabel,
  Stack,
  InputAdornment,
  Chip,
  Paper,
  alpha,
  Skeleton
} from '@mui/material';

// Material UI Icons
import {
  SortByAlpha as SortByAlphaIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CalendarToday as CalendarTodayIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  CloudDownload as CloudDownloadIcon,
  RestartAlt as RestartAltIcon,
  Timer as TimerIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  Numbers as NumbersIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

import attendenceApi from '../../api/attendenceApi';

// Office coordinates for BBSR Chandrasekharpur
const OFFICE_LOCATION = {
  latitude: 20.256607,  
  longitude: 85.825123,
};
const MAX_DISTANCE = 100; // Maximum allowed distance in meters

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6378; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
};

const checkLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        console.log('Current position:', { lat: userLat, lon: userLon });
        console.log('Office position:', OFFICE_LOCATION);
        
        const distance = calculateDistance(
          userLat,
          userLon,
          OFFICE_LOCATION.latitude,
          OFFICE_LOCATION.longitude
        );

        console.log('Distance from office:', distance, 'meters');
        
        // Strict 100-meter check
        if (distance <= 0.001) {
          console.log('User is within office range');
          resolve(true);
        } else {
          console.log('User is outside office range');
          reject(new Error(`You are ${Math.round(distance)} meters away from office. Maximum allowed distance is ${MAX_DISTANCE} meters.`));
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location.';
        if (error.code === 1) {
          errorMessage = 'Please enable location services in your browser settings and refresh the page.';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please check your GPS or network connection.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0  // Always get fresh position
      }
    );
  });
};

let lastKnownPosition = null;

const AddAttendence = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentShiftState, attendanceHistory, loading } = useSelector((state) => state.addAttendence);

  const [employeeData, setEmployeeData] = useState(null);
  const [departmentData, setDepartmentData] = useState(null);
  const [error, setError] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [viewEmail, setViewEmail] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    // Check if we're in view mode
    const storedEmail = localStorage.getItem('viewEmail');
    if (storedEmail) {
      setViewEmail(storedEmail);
      setIsViewMode(true);
      localStorage.removeItem('viewEmail');
    }

    // Fetch initial data
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const email = viewEmail || localStorage.getItem('email');
      console.log('Fetching data for email:', email);

      const data = await attendenceApi.fetchEmployeeData(email);
      console.log('Fetched data:', data);

      setEmployeeData(data.employeeDetails);
      setDepartmentData(data.departmentDetails);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);

      if (error?.message && error.message.includes('Email not found')) {
        router.push('/login');
      }
    }
  };

  const handleAttendanceAction = async (action) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error('No email found');
      }

      // Dispatch the attendance action
      const resultAction = await dispatch(markAttendance({ action, email }));
      
      if (markAttendance.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: 'Attendance marked successfully',
          severity: 'success'
        });
      } else if (markAttendance.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error marking attendance',
        severity: 'error'
      });
    }
  };

  const getButtonText = () => {
    switch (currentShiftState) {
      case 'shift1CheckIn':
        return 'Check In - Shift 1';
      case 'shift1CheckOut':
        return 'Check Out - Shift 1';
      case 'shift2CheckIn':
        return 'Check In - Shift 2';
      case 'shift2CheckOut':
        return 'Check Out - Shift 2';
      default:
        return 'Check In - Shift 1';
    }
  };

  // Location Status Component
  const LocationStatus = () => {
    const [status, setStatus] = useState('checking');

    useEffect(() => {
      checkLocation()
        .then(() => setStatus('within-range'))
        .catch(() => setStatus('out-of-range'));
    }, []);

    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 2,
        p: 1.5,
        borderRadius: 1,
        width: '100%',
        bgcolor: status === 'within-range' ? alpha('#4caf50', 0.1) :
          status === 'out-of-range' ? alpha('#f44336', 0.1) : alpha('#ff9800', 0.1),
        border: '1px solid',
        borderColor: status === 'within-range' ? alpha('#4caf50', 0.2) :
          status === 'out-of-range' ? alpha('#f44336', 0.2) : alpha('#ff9800', 0.2),
      }}>
        <Box
          component="span"
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: status === 'within-range' ? '#4caf50' :
              status === 'out-of-range' ? '#f44336' : '#ff9800',
            animation: status === 'checking' ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.4 },
              '100%': { opacity: 1 },
            }
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: status === 'within-range' ? '#1b5e20' :
              status === 'out-of-range' ? '#b71c1c' : '#e65100',
            fontWeight: 500,
            fontSize: '0.875rem'
          }}
        >
          {status === 'within-range' ? 'Within office range' :
            status === 'out-of-range' ? 'Outside office range' : 'Checking location...'}
        </Typography>
      </Box>
    );
  };

  // Render attendance button with location status
  const renderAttendanceButton = () => {
    const isCheckIn = currentShiftState.includes('CheckIn');
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Button
          onClick={() => handleAttendanceAction(currentShiftState)}
          disabled={loading}
          variant="contained"
          sx={{
            borderRadius: '50px',
            padding: '12px 36px',
            fontSize: '1.1rem',
            textTransform: 'none',
            backgroundColor: isCheckIn ? '#4CAF50' : '#f44336',
            boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              backgroundColor: isCheckIn ? '#45a049' : '#d32f2f',
              transform: 'translateY(-2px)',
              boxShadow: '0 5px 10px 2px rgba(0, 0, 0, 0.2)',
            },
            '&:active': {
              transform: 'translateY(1px)',
              boxShadow: '0 2px 4px 1px rgba(0, 0, 0, 0.15)',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))',
              transition: 'opacity 0.3s ease-in-out',
              opacity: 0,
            },
            '&:hover::after': {
              opacity: 1,
            },
            '&.Mui-disabled': {
              backgroundColor: '#ccc',
              cursor: 'not-allowed',
            }
          }}
        >
          {loading ? (
            <CircularProgress 
              size={24} 
              sx={{ 
                color: 'white',
                animation: 'fadeIn 0.3s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }} 
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              animation: 'slideIn 0.3s ease-out',
              '@keyframes slideIn': {
                '0%': { 
                  opacity: 0,
                  transform: 'translateX(-10px)'
                },
                '100%': { 
                  opacity: 1,
                  transform: 'translateX(0)'
                }
              }
            }}>
              {isCheckIn ? (
                <LoginIcon sx={{ fontSize: 20 }} />
              ) : (
                <LogoutIcon sx={{ fontSize: 20 }} />
              )}
              {getButtonText()}
            </Box>
          )}
        </Button>

        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <LocationStatus />
        </Box>
      </Box>
    );
  };

  // Status indicator with smooth transitions
  const StatusIndicator = ({ status }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.75,
        borderRadius: 1,
        bgcolor: alpha(status === 'Present' ? '#4CAF50' : '#F44336', 0.1),
        border: '1px solid',
        borderColor: alpha(status === 'Present' ? '#4CAF50' : '#F44336', 0.2),
        width: 'fit-content',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          bgcolor: alpha(status === 'Present' ? '#4CAF50' : '#F44336', 0.15),
          transform: 'translateY(-1px)',
        }
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: status === 'Present' ? '#4CAF50' : '#F44336',
          transition: 'all 0.3s ease-in-out',
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)'
            },
            '70%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 6px rgba(76, 175, 80, 0)'
            },
            '100%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)'
            }
          }
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: alpha(status === 'Present' ? '#4CAF50' : '#F44336', 0.8),
          transition: 'color 0.3s ease-in-out'
        }}
      >
        {status}
      </Typography>
    </Box>
  );

  // Add these states for lazy loading
  const [displayedItems, setDisplayedItems] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Intersection Observer for lazy loading
  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [displayedItems, isLoading]);

  const loadMoreItems = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayedItems(prev => prev + 10);
      setIsLoading(false);
    }, 500);
  };

  // Loading skeleton for table rows
  const TableRowSkeleton = () => (
    <TableRow>
      {[...Array(7)].map((_, index) => (
        <TableCell key={index}>
          <Skeleton 
            animation="wave" 
            sx={{ 
              height: 24,
              transform: 'scale(1, 0.8)',
              transformOrigin: '0 0',
              backgroundColor: 'rgba(0,0,0,0.04)'
            }} 
          />
        </TableCell>
      ))}
    </TableRow>
  );

  // Update the attendance history render function
  const renderAttendanceHistory = () => {
    const filteredHistory = getSortedAndFilteredHistory();
    const displayedHistory = filteredHistory.slice(0, displayedItems);
    const hasMore = displayedHistory.length < filteredHistory.length;

    return (
      <Box sx={{ 
        mt: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
        }
      }}>
        <TableContainer 
          component={Paper} 
          sx={{
            maxHeight: 600,
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
              '&:hover': {
                background: '#666',
              },
            },
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 #f1f1f1',
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: '#f5f5f5',
                transition: 'background-color 0.3s ease-in-out',
                '& th': {
                  fontWeight: 600,
                  color: '#333',
                  transition: 'all 0.3s ease-in-out',
                  backgroundColor: '#f5f5f5',
                }
              }}>
                <TableCell>Date</TableCell>
                <TableCell>Shift 1 In</TableCell>
                <TableCell>Shift 1 Out</TableCell>
                <TableCell>Shift 2 In</TableCell>
                <TableCell>Shift 2 Out</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedHistory.map((record) => (
                <TableRow 
                  key={record._id || Math.random()}
                  sx={{
                    transition: 'background-color 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: alpha('#000', 0.02)
                    }
                  }}
                >
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.shift1_time_in || '-'}</TableCell>
                  <TableCell>{record.shift1_time_out || '-'}</TableCell>
                  <TableCell>{record.shift2_time_in || '-'}</TableCell>
                  <TableCell>{record.shift2_time_out || '-'}</TableCell>
                  <TableCell>{formatWorkingHours(record.working_hours)}</TableCell>
                  <TableCell>
                    <StatusIndicator status={record.status} />
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && [...Array(3)].map((_, index) => (
                <TableRowSkeleton key={`skeleton-${index}`} />
              ))}
              {hasMore && (
                <TableRow ref={observerTarget}>
                  <TableCell colSpan={7} align="center" sx={{ border: 'none', p: 2 }}>
                    <CircularProgress 
                      size={24} 
                      sx={{ 
                        color: 'primary.main',
                        opacity: isLoading ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out'
                      }} 
                    />
                  </TableCell>
                </TableRow>
              )}
              {displayedHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const formatWorkingHours = (hours) => {
    if (!hours) return '-';
    const [h, m] = hours.split(':');
    return `${h}h ${m}m`;
  };

  // Sort and filter function
  const getSortedAndFilteredHistory = () => {
    if (!attendanceHistory || !Array.isArray(attendanceHistory)) return [];

    let filtered = [...attendanceHistory];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    if (sortOrder !== 'none') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  };

  // UI states
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [sortOrder, setSortOrder] = useState('none');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check if we're in view mode
    const storedViewEmail = localStorage.getItem('viewEmail');
    if (storedViewEmail) {
      console.log('View mode activated for email:', storedViewEmail);
      setIsViewMode(true);
      setViewEmail(storedViewEmail);
      // Clear the stored email
      localStorage.removeItem('viewEmail');
    }
  }, []);

  // UI handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGenerateCSV = () => {
    setOpenDatePicker(true);
    handleMenuClose();
  };

  const handleResetDates = () => {
    setDateRange({ startDate: '', endDate: '' });
    handleMenuClose();
    setSnackbar({
      open: true,
      message: '✓ Date range reset successfully',
      severity: 'success'
    });
  };

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadCSV = async () => {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        setSnackbar({
          open: true,
          message: "Please select both start and end dates",
          severity: "warning"
        });
        return;
      }

      const data = await attendenceApi.getAttendanceCSV(dateRange.startDate, dateRange.endDate);

      if (!data.csvData) {
        throw new Error('No attendance data found for selected date range');
      }

      // Create CSV content and download
      const blob = new Blob([data.csvData], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `attendance_${dateRange.startDate}_to_${dateRange.endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Attendance report downloaded successfully!",
        severity: "success"
      });
      setOpenDatePicker(false);
    } catch (error) {
      console.error("Download error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to generate attendance report",
        severity: "error"
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const email = localStorage.getItem('email');
        if (email) {
          const data = await attendenceApi.fetchEmployeeData(email);
          if (data && data.attendanceHistory) {
            dispatch(setAttendanceHistory(data.attendanceHistory));
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#000000', fontWeight: 600 }}>
        {isViewMode ? 'Attendance History' : 'Mark Attendance'}
      </Typography>

      {/* First row with Back button card */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
          }}>
            <CardContent sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2 // Reduced padding
            }}>
              <Button
                onClick={() => router.back()}
                sx={{
                  color: 'white',
                  bgcolor: '#1a1a1a',
                  '&:hover': { bgcolor: '#333' },
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ArrowBackIcon /> Back
              </Button>

              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                    mt: 1
                  }
                }}
              >
                <MenuItem onClick={handleGenerateCSV} sx={{ gap: 1 }}>
                  <CloudDownloadIcon fontSize="small" />
                  Generate CSV
                </MenuItem>
                <MenuItem onClick={handleResetDates} sx={{ gap: 1 }}>
                  <RestartAltIcon fontSize="small" />
                  Reset Dates
                </MenuItem>
              </Menu>
            </CardContent>
          </Card>
        </Grid>

        {/* Second row with Employee Info and Attendance History */}
        <Grid item xs={12} md={4}>
          {/* Employee Info Card */}
          <Card sx={{
            height: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
          }}>
            <CardContent>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <React.Fragment>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Avatar
                      sx={{ width: 100, height: 100, margin: '0 auto', mb: 2 }}
                      alt={employeeData?.name || 'User'}
                      src="/avatar-placeholder.png"
                    />
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {employeeData?.name || 'Loading...'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <BadgeIcon sx={{ color: '#666' }} />
                      <Typography>
                        <strong>Employee ID:</strong> {employeeData?.employee_id ? `EMP${employeeData.employee_id}` : 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <EmailIcon sx={{ color: '#666' }} />
                      <Typography>
                        <strong>Email:</strong> {employeeData?.email || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <BusinessIcon sx={{ color: '#666' }} />
                      <Typography>
                        <strong>Department:</strong> {departmentData?.department_name || 'N/A'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                      <NumbersIcon sx={{ color: '#666' }} />
                      <Typography>
                        <strong>Department ID:</strong> {departmentData?.department_id || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {!isViewMode && currentShiftState !== 'completed' && renderAttendanceButton()}
                  </Box>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            minHeight: '500px' // Increased height
          }}>
            <CardContent>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Attendance History
                </Typography>

                <Stack direction="row" spacing={2}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SortIcon sx={{ fontSize: 18 }} />
                        Sort By
                      </Box>
                    </InputLabel>
                    <Select
                      value={sortOrder}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SortIcon sx={{ fontSize: 18 }} />
                          Sort By
                        </Box>
                      }
                      onChange={(e) => setSortOrder(e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }
                      }}
                    >
                      <MenuItem value="none">
                        <SortIcon sx={{ fontSize: 18 }} /> None
                      </MenuItem>
                      <MenuItem value="asc">
                        <ArrowUpwardIcon sx={{ fontSize: 18 }} /> A to Z
                      </MenuItem>
                      <MenuItem value="desc">
                        <ArrowDownwardIcon sx={{ fontSize: 18 }} /> Z to A
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <FilterAltIcon sx={{ fontSize: 18 }} />
                        Filter By
                      </Box>
                    </InputLabel>
                    <Select
                      value={statusFilter}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FilterAltIcon sx={{ fontSize: 18 }} />
                          Filter By
                        </Box>
                      }
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      {['Present', 'Absent', 'Holiday', 'Leave'].map((status) => (
                        <MenuItem key={status} value={status}>
                          <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: status === 'Present' ? '#4CAF50' :
                              status === 'Absent' ? '#F44336' :
                                status === 'Holiday' ? '#FFC107' : '#2196F3',
                            mr: 1
                          }} />
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : !attendanceHistory || attendanceHistory.length === 0 ? (
                <Typography sx={{ textAlign: 'center', py: 3, color: '#666' }}>
                  No attendance records found
                </Typography>
              ) : (
                renderAttendanceHistory()
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Third row with Status Legend */}
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
          }}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack
                direction="row"
                spacing={3}
                flexWrap="wrap"
                justifyContent="center"
                marginTop="6px"

                alignItems="center"
                sx={{ py: 0.5 }}
              >
                {[
                  { label: 'Present', color: '#4CAF50' },
                  { label: 'Absent', color: '#F44336' },
                  { label: 'Holiday', color: '#FFC107' },
                  { label: 'Leave', color: '#2196F3' }
                ].map((status) => (
                  <Box
                    key={status.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 0.75,
                      borderRadius: 1,
                      bgcolor: alpha(status.color, 0.1),
                      border: '1px solid',
                      borderColor: alpha(status.color, 0.2),
                      margin: '8px',
                    }}
                  >
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: status.color
                    }} />
                    <Typography variant="body2" sx={{
                      fontWeight: 500,
                      color: alpha(status.color, 0.8)
                    }}>
                      {status.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Back Button for View Mode */}
      {isViewMode && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => router.push('/attendance')}
            variant="contained"
            sx={{
              bgcolor: '#000',
              '&:hover': { bgcolor: '#333' },
              minWidth: '200px'
            }}
          >
            Back to All Attendance
          </Button>
        </Box>
      )}

      <Dialog
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          fontWeight: 600,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          Download Attendance Report
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Start Date
              </Typography>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                style={{
                  padding: '10px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.2)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                End Date
              </Typography>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                style={{
                  padding: '10px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.2)',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
          <Button
            onClick={() => setOpenDatePicker(false)}
            sx={{
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={downloadCSV}
            disabled={!dateRange.startDate || !dateRange.endDate}
            sx={{
              bgcolor: 'black',
              color: 'white',
              '&:hover': {
                bgcolor: '#333'
              },
              '&.Mui-disabled': {
                bgcolor: 'rgba(0,0,0,0.12)',
                color: 'rgba(0,0,0,0.26)'
              }
            }}
          >
            Download CSV
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}/* eslint-disable indent */
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          mb: 4, // Add margin bottom to lift it slightly from the screen edge
          '& .MuiSnackbar-root': {
            bottom: '24px'
          }
        }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}/* eslint-enable indent */
          sx={{
            minWidth: '300px',
            borderRadius: '50px', // More rounded corners
            backgroundColor: snackbar.severity === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '12px 24px',
            '& .MuiAlert-icon': {
              color: 'white',
              marginRight: '8px'
            },
            '& .MuiAlert-message': {
              padding: '4px 0',
              fontSize: '15px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            },
            '& .MuiAlert-action': {
              padding: '0 8px',
              marginRight: '-8px'
            },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            '& .MuiSvgIcon-root': {
              fontSize: '20px'
            },
            animation: 'slideUp 0.3s ease-out'
          }}
          icon={false} // Remove default icon as we're using custom icons in the message
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAttendence;