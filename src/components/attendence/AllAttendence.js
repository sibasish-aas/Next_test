"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAttendances } from '../../redux/slices/AttendenceSlice';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  RestartAlt as RestartAltIcon,
  FileDownload as FileDownloadIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import Papa from 'papaparse';
import attendenceApi from '../../api/attendenceApi';
import InfiniteScroll from 'react-infinite-scroll-component';

const AllAttendance = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { allAttendances, loading, error } = useSelector((state) => state.attendance);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // States for filtering and sorting
  const [sortOrder, setSortOrder] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeAttendance, setEmployeeAttendance] = useState(null);
  const [loadingData, setLoading] = useState(false);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterBy, setFilterBy] = useState('all');
  const [displayedAttendance, setDisplayedAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 10;

  // Enhanced sort and filter states
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  // Add filteredAttendances state
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  // Function to sort attendance data
  const sortData = useCallback((data, config) => {
    if (!config.key) return data;

    return [...data].sort((a, b) => {
      if (config.key === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return config.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (config.key === 'status') {
        return config.direction === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });
  }, []);

  // Function to filter attendance data
  const filterData = useCallback((data, statusFilter, shiftFilter) => {
    return data.filter(item => {
      const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
      
      let matchesShift = true;
      if (shiftFilter !== 'all') {
        if (shiftFilter === 'shift1') {
          matchesShift = item.shift1_time_in || item.shift1_time_out;
        } else if (shiftFilter === 'shift2') {
          matchesShift = item.shift2_time_in || item.shift2_time_out;
        }
      }
      
      return matchesStatus && matchesShift;
    });
  }, []);

  // Load more data function for infinite scroll
  const loadMoreData = useCallback(() => {
    if (employeeAttendance?.attendanceHistory) {
      const start = page * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newData = employeeAttendance.attendanceHistory.slice(start, end);
      
      if (newData.length > 0) {
        setDisplayedAttendance(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    }
  }, [page, employeeAttendance]);

  // Reset displayed data when employee changes or sort/filter changes
  useEffect(() => {
    if (employeeAttendance?.attendanceHistory) {
      const sortedData = sortData(employeeAttendance.attendanceHistory, sortConfig);
      const filteredData = filterData(sortedData, filterBy, shiftFilter);
      setDisplayedAttendance(filteredData.slice(0, ITEMS_PER_PAGE));
      setPage(1);
      setHasMore(filteredData.length > ITEMS_PER_PAGE);
    }
  }, [employeeAttendance, sortConfig, filterBy, shiftFilter]);

  console.log("dfsdgd",allAttendances);

  const [openDateDialog, setOpenDateDialog] = useState(false);
const [dateRange, setDateRange] = useState({
  startDate: '',
  endDate: ''
});
  

  // Effect to fetch data
  useEffect(() => {
    dispatch(fetchAllAttendances());
  }, [dispatch]);

  // Update the initial data load
  useEffect(() => {
    if (allAttendances && allAttendances.length > 0) {
      setFilteredAttendances(allAttendances);
    }
  }, [allAttendances]);

  // Update the filtering effect
  useEffect(() => {
    if (allAttendances && allAttendances.length > 0) {
      let results = [...allAttendances];

      // Apply status filter
      if (statusFilter !== 'all') {
        results = results.filter(item => 
          item.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      // Apply shift filter
      if (shiftFilter !== 'all') {
        results = results.filter(item => {
          if (shiftFilter === 'shift1') {
            return item.shift1_time_in || item.shift1_time_out;
          } else if (shiftFilter === 'shift2') {
            return item.shift2_time_in || item.shift2_time_out;
          }
          return true;
        });
      }

      // Apply search filter if exists
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter(item => 
          (item.employee?.name?.toLowerCase() || '').includes(query) ||
          (item.employee?.employee_id?.toString() || '').includes(query) ||
          (item.employee?.department?.department_name?.toLowerCase() || '').includes(query)
        );
      }

      setFilteredAttendances(results);
    }
  }, [allAttendances, statusFilter, shiftFilter, searchQuery]);

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  // Updated time format function
  const formatTime = (time) => {
    if (!time || time === '-') return '-';
    
    // If time is already in HH:mm format, just convert to 12-hour format
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).replace(/^0/, '');
    }
    
    return '-';
  };

  // Format working hours
  const formatDuration = (duration) => {
    if (!duration) return '0 hrs';
    
    // If duration is already in HH:mm format
    if (duration.includes(':')) {
      const [hours, minutes] = duration.split(':');
      if (hours === '00' && minutes === '00') return '0 hrs';
      if (hours === '00') return `${parseInt(minutes)} mins`;
      if (minutes === '00') return `${parseInt(hours)} hrs`;
      return `${parseInt(hours)}h ${parseInt(minutes)}m`;
    }
    
    return duration;
  };

  // Format date for Excel compatibility
  const formatDateForExcel = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;  // DD/MM/YYYY format for Excel
  };

  // Add this new function to handle CSV generation
  const generateCSV = async () => {
    try {
      setIsExporting(true);

      // Prepare data in the correct format for Papa Parse
      
      const dataToExport = allAttendances.map(row => ({
        'S.I. No': row._id,
        'Employee ID': row.employee_id,
        'Name': row.employee_name,
        'Department': row.department_name,
        'Date': row.date,
        'Shift 1 Check-in': row.shift1_time_in,
        'Shift 1 Check-out': row.shift1_time_out,
        'Shift 2 Check-in': row.shift2_time_in,
        'Shift 2 Check-out': row.shift2_time_out,
        'Duration': row.working_hours,
        'Status': row.status
      }));

      const csv = Papa.unparse(dataToExport, {
        quotes: true,
        header: true,
        encoding: 'utf-8'
      });

      // Create blob with BOM for Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const date = new Date().toISOString().split('T')[0];
      const filename = `attendance_report_${date}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      setSnackbar({
        open: true,
        message: '✓ CSV file downloaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('CSV generation error:', error);
      setSnackbar({
        open: true,
        message: '✕ Failed to generate CSV file',
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleRowClick = async (row) => {
    console.log('Row clicked:', row);
    const email = row.employee_email;
    console.log('Email:', email);
    
    if (email) {
      try {
        setLoading(true);
        console.log('Fetching data for email:', email);
        const data = await attendenceApi.fetchEmployeeData(email);
        console.log('Fetched data:', data);
        
        setSelectedEmployee({
          name: row.employee_name,
          email: row.employee_email,
          employee_id: row.employee_id,
        });
        setEmployeeAttendance({
          departmentDetails: {
            department_name: row.department_name
          },
          attendanceHistory: [{
            date: row.date,
            shift1_time_in: row.shift1_time_in,
            shift1_time_out: row.shift1_time_out,
            shift2_time_in: row.shift2_time_in,
            shift2_time_out: row.shift2_time_out,
            working_hours: row.working_hours,
            status: row.status
          }]
        });
        setOpenModal(true);
        console.log('Modal should be open now');
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load employee details',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
    setEmployeeAttendance(null);
  };

  const handleDownloadCSV = async (email) => {
    try {
      setIsExporting(true);

      // Prepare data in the correct format for Papa Parse
      const dataToExport = employeeAttendance.attendanceHistory.map(row => ({
        'Date': row.date,
        'Shift 1 Check-in': row.shift1_time_in,
        'Shift 1 Check-out': row.shift1_time_out,
        'Shift 2 Check-in': row.shift2_time_in,
        'Shift 2 Check-out': row.shift2_time_out,
        'Duration': row.working_hours,
        'Status': row.status
      }));

      const csv = Papa.unparse(dataToExport, {
        quotes: true,
        header: true,
        encoding: 'utf-8'
      });

      // Create blob with BOM for Excel
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csv], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const date = new Date().toISOString().split('T')[0];
      const filename = `attendance_report_${email}_${date}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      setSnackbar({
        open: true,
        message: '✓ CSV file downloaded successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('CSV generation error:', error);
      setSnackbar({
        open: true,
        message: '✕ Failed to generate CSV file',
        severity: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  
  console.log("att data",filteredAttendances);
  

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Title */}
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4, color: '#000000', fontWeight: 600 }}>
        All Attendances
      </Typography>

      {/* Controls Card */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2.5,
          mb: 4,
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.08)',
          bgcolor: 'white',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Stack 
              direction="row" 
              spacing={2}
              alignItems="center"
              justifyContent="flex-end"
              sx={{ width: '100%' }}
            >
              {/* Date Inputs */}
              <TextField
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                size="small"
                InputProps={{
                  sx: {
                    bgcolor: '#f8f9fa',
                    borderRadius: '8px',
                    '& fieldset': { 
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': { 
                      borderColor: 'rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000 !important',
                    },
                    height: '40px',
                    width: '160px'
                  }
                }}
              />
              <Typography sx={{ color: '#666' }}>to</Typography>
              <TextField
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                size="small"
                InputProps={{
                  sx: {
                    bgcolor: '#f8f9fa',
                    borderRadius: '8px',
                    '& fieldset': { 
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                    '&:hover fieldset': { 
                      borderColor: 'rgba(0,0,0,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000 !important',
                    },
                    height: '40px',
                    width: '160px'
                  }
                }}
              />

              <Button
                onClick={generateCSV}
                startIcon={<FileDownloadIcon />}
                variant="contained"
                sx={{
                  bgcolor: '#000',
                  '&:hover': { 
                    bgcolor: '#333',
                  }
                }}
              >
                Generate CSV
              </Button>

              <Button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setShiftFilter('all');
                  setFilteredAttendances(allAttendances);
                  setSnackbar({
                    open: true,
                    message: '✓ Filters reset successfully',
                    severity: 'success'
                  });
                }}
                startIcon={<RestartAltIcon />}
                variant="contained"
                sx={{
                  bgcolor: '#000',
                  '&:hover': { 
                    bgcolor: '#333',
                  }
                }}
              >
                Reset
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Table Controls */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2
      }}>
        <TextField
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
            sx: {
              '& fieldset': { border: 'none' },
              bgcolor: '#fff',
              borderRadius: '10px',
              width: '300px'
            }
          }}
        />
        
        <Stack direction="row" spacing={2}>
          <Button
            onClick={(e) => setSortAnchorEl(e.currentTarget)}
            startIcon={<SortIcon />}
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#000',
              '&:hover': { bgcolor: '#333' }
            }}
          >
            Sort By
          </Button>

          <IconButton
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            sx={{
              color: '#666',
              bgcolor: filterAnchorEl ? 'rgba(0,0,0,0.1)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Table Container */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.1)',
          mb: 4,
          minHeight: '650px',
          '& .MuiTableCell-root': {
            py: 3,
            fontSize: '0.95rem'
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ 
              bgcolor: '#f5f5f5',
              '& th': { 
                fontWeight: 600,
                whiteSpace: 'nowrap',
                borderBottom: '2px solid rgba(0,0,0,0.1)',
                py: 2.5
              }
            }}>
              <TableCell>S.No</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Shift 1 Check-in</TableCell>
              <TableCell align="center">Shift 1 Check-out</TableCell>
              <TableCell align="center">Shift 2 Check-in</TableCell>
              <TableCell align="center">Shift 2 Check-out</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={11} 
                  align="center" 
                  sx={{ py: 8 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell 
                  colSpan={11} 
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : filteredAttendances.length > 0 ? (
              filteredAttendances.map((row, index) => (
                <TableRow 
                  key={row._id || row.id}
                  onClick={() => {
                    console.log('Row data:', row);
                    handleRowClick(row);
                  }}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { 
                      bgcolor: 'rgba(0,0,0,0.04)',
                      '& td': { color: '#000' }
                    },
                    transition: 'all 0.2s',
                    '& td': {
                      color: '#444',
                      borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.employee_id || 'N/A'}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{row.employee_name || 'N/A'}</TableCell>
                  <TableCell>{row.department_name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
                  <TableCell align="center">{formatTime(row.shift1_time_in)}</TableCell>
                  <TableCell align="center">{formatTime(row.shift1_time_out)}</TableCell>
                  <TableCell align="center">{formatTime(row.shift2_time_in)}</TableCell>
                  <TableCell align="center">{formatTime(row.shift2_time_out)}</TableCell>
                  <TableCell>{formatDuration(row.working_hours)}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1 
                    }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%',
                        bgcolor: row.status === 'Present' ? '#4CAF50' : 
                                row.status === 'Absent' ? '#F44336' : 
                                row.status === 'Half-Day' ? '#FFC107' :
                                row.status === 'Holiday' ? '#000000' :
                                row.status === 'Weekend' ? '#009688' : '#3F51B5'
                      }} />
                      {row.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={11} 
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography>No matching records found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Legend */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          borderRadius: 2,
          border: '1px solid rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[/* ... */].map((status) => (
            <Box key={status.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: status.color
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {status.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Updated Snackbar position to bottom center */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          mb: 4, // Add margin bottom for better visibility
          '& .MuiPaper-root': {
            minWidth: '300px',
            borderRadius: '10px'
          }
        }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            width: '100%',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }
        }}
      >
        <MenuItem onClick={() => handleSort('name_asc')}>
          <KeyboardArrowUpIcon sx={{ mr: 1 }} /> Name (A-Z)
        </MenuItem>
        <MenuItem onClick={() => handleSort('name_desc')}>
          <KeyboardArrowDownIcon sx={{ mr: 1 }} /> Name (Z-A)
        </MenuItem>
        <MenuItem onClick={() => handleSort('date_asc')}>
          <KeyboardArrowUpIcon sx={{ mr: 1 }} /> Date (Oldest)
        </MenuItem>
        <MenuItem onClick={() => handleSort('date_desc')}>
          <KeyboardArrowDownIcon sx={{ mr: 1 }} /> Date (Latest)
        </MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: {
            mt: 1,
            width: 200,
            maxHeight: '70vh'
          }
        }}
      >
        <MenuItem
          onClick={() => {
            setStatusFilter('all');
            setShiftFilter('all');
            setFilterAnchorEl(null);
          }}
        >
          All
        </MenuItem>
        <Divider />
        <Typography sx={{ px: 2, py: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
          Status
        </Typography>
        {['Present', 'Absent', 'Holiday', 'Leave'].map((status) => (
          <MenuItem
            key={status}
            onClick={() => {
              setStatusFilter(status.toLowerCase());
              setFilterAnchorEl(null);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: statusFilter === status.toLowerCase() ? 'primary.main' : 'inherit'
            }}
          >
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: status === 'Present' ? '#4CAF50' :
                status === 'Absent' ? '#F44336' :
                status === 'Holiday' ? '#FFC107' : '#2196F3'
            }} />
            {status}
          </MenuItem>
        ))}
        <Divider />
        <Typography sx={{ px: 2, py: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
          Shift
        </Typography>
        {[
          { value: 'shift1', label: 'Shift 1' },
          { value: 'shift2', label: 'Shift 2' }
        ].map((shift) => (
          <MenuItem
            key={shift.value}
            onClick={() => {
              setShiftFilter(shift.value);
              setFilterAnchorEl(null);
            }}
            sx={{
              color: shiftFilter === shift.value ? 'primary.main' : 'inherit'
            }}
          >
            {shift.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Employee Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            bgcolor: '#fff',
            maxHeight: '90vh',
            margin: 2,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.002)'
            }
          }
        }}
      >
        <DialogContent sx={{ p: 0, overflowY: 'auto' }}>
          {loadingData ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <CircularProgress />
            </Box>
          ) : selectedEmployee && employeeAttendance ? (
            <Box sx={{ p: 4 }}>
              {/* Profile Section with hover effect */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: 6,
                mb: 4,
                pb: 4,
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                px: 4,
                py: 3,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }
              }}>
                {/* Avatar Container */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  pt: 2
                }}>
                  {/* Avatar */}
                  <Box sx={{ 
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: '#757575',
                    flexShrink: 0,
                    mb: 2,
                    border: '4px solid #f5f5f5'
                  }}>
                    {selectedEmployee.name?.charAt(0).toUpperCase() || 'U'}
                  </Box>
                  
                  {/* Name under avatar */}
                  <Typography variant="h4" sx={{ 
                    fontWeight: 600,
                    fontSize: '1.75rem',
                    color: '#333',
                    textAlign: 'center'
                  }}>
                    {selectedEmployee.name}
                  </Typography>
                </Box>

                {/* Employee Details */}
                <Box sx={{ flex: 1, pt: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: 120,
                          color: '#666',
                          gap: 1
                        }}>
                          <Box component="span" sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '1.1rem'
                          }}>
                            👤
                          </Box>
                          Employee ID
                        </Box>
                        <Typography sx={{ 
                          fontWeight: 500,
                          color: '#333',
                          ml: 1
                        }}>
                          {selectedEmployee.employee_id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: 120,
                          color: '#666',
                          gap: 1
                        }}>
                          <Box component="span" sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '1.1rem'
                          }}>
                            📧
                          </Box>
                          Email
                        </Box>
                        <Typography sx={{ 
                          fontWeight: 500,
                          color: '#333',
                          ml: 1
                        }}>
                          {selectedEmployee.email}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: 120,
                          color: '#666',
                          gap: 1
                        }}>
                          <Box component="span" sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '1.1rem'
                          }}>
                            🏢
                          </Box>
                          Department
                        </Box>
                        <Typography sx={{ 
                          fontWeight: 500,
                          color: '#333',
                          ml: 1
                        }}>
                          {employeeAttendance.departmentDetails?.department_name || 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: 120,
                          color: '#666',
                          gap: 1
                        }}>
                          <Box component="span" sx={{ 
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '1.1rem'
                          }}>
                            🔢
                          </Box>
                          Department ID
                        </Box>
                        <Typography sx={{ 
                          fontWeight: 500,
                          color: '#333',
                          ml: 1
                        }}>
                          {employeeAttendance.departmentDetails?.department_id || '1'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Close Button */}
                <IconButton 
                  onClick={handleCloseModal}
                  sx={{ 
                    color: '#666',
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    '&:hover': { 
                      color: '#000',
                      bgcolor: 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Attendance History Section */}
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Attendance History
                  </Typography>
                  
                  {/* Download CSV Section */}
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0,0,0,0.2)',
                          },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      size="small"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1,
                          bgcolor: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(0,0,0,0.1)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(0,0,0,0.2)',
                          },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<FileDownloadIcon />}
                      onClick={() => handleDownloadCSV(selectedEmployee.email)}
                      sx={{ 
                        bgcolor: 'black',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#333',
                        },
                        textTransform: 'none',
                        boxShadow: 'none',
                      }}
                    >
                      Export CSV
                    </Button>
                  </Box>
                </Box>

                {/* Filter and Sort Section */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  gap: 2,
                  mb: 2 
                }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={filterBy}
                      label="Status Filter"
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      {['Present', 'Absent', 'Holiday', 'Leave'].map((status) => (
                        <MenuItem key={status} value={status.toLowerCase()}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: status === 'Present' ? '#4CAF50' :
                                status === 'Absent' ? '#F44336' :
                                status === 'Holiday' ? '#FFC107' : '#F44336'
                            }} />
                            {status}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Shift Filter</InputLabel>
                    <Select
                      value={shiftFilter}
                      label="Shift Filter"
                      onChange={(e) => setShiftFilter(e.target.value)}
                    >
                      <MenuItem value="all">All Shifts</MenuItem>
                      <MenuItem value="shift1">Shift 1</MenuItem>
                      <MenuItem value="shift2">Shift 2</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Attendance Table with Infinite Scroll */}
                <Box id="scrollableDiv" sx={{ 
                  height: '400px', 
                  overflow: 'auto',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                  }
                }}>
                  <InfiniteScroll
                    dataLength={displayedAttendance.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <CircularProgress size={24} />
                      </Box>
                    }
                    scrollableTarget="scrollableDiv"
                  >
                    <TableContainer component={Paper} elevation={0} sx={{ 
                      border: '1px solid rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                      }
                    }}>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
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
                          {displayedAttendance.map((record, index) => (
                            <TableRow 
                              key={index}
                              sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: 'rgba(0,0,0,0.02)',
                                  transform: 'scale(1.001)'
                                }
                              }}
                            >
                              <TableCell>{formatDate(record.date)}</TableCell>
                              <TableCell>{formatTime(record.shift1_time_in)}</TableCell>
                              <TableCell>{formatTime(record.shift1_time_out)}</TableCell>
                              <TableCell>{formatTime(record.shift2_time_in)}</TableCell>
                              <TableCell>{formatTime(record.shift2_time_out)}</TableCell>
                              <TableCell>{formatDuration(record.working_hours)}</TableCell>
                              <TableCell>
                                <Box sx={{ 
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  px: 2,
                                  py: 0.5,
                                  borderRadius: '20px',
                                  bgcolor: record.status === 'Present' ? '#4CAF50' :
                                          record.status === 'Absent' ? '#F44336' :
                                          record.status === 'Half-Day' ? '#FFC107' : '#F44336',
                                  color: 'white'
                                }}>
                                  {record.status}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </InfiniteScroll>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">No data available</Typography>
            </Box>
          )}

          {/* Modal Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              position: 'absolute',
              top: '16px !important',
              right: '16px !important'
            }}
          >
            <Alert 
              onClose={handleSnackbarClose} 
              severity={snackbar.severity}
              sx={{ 
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                animation: 'slideIn 0.3s ease-out',
                '@keyframes slideIn': {
                  from: {
                    transform: 'translateX(100%)',
                    opacity: 0
                  },
                  to: {
                    transform: 'translateX(0)',
                    opacity: 1
                  }
                }
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AllAttendance;