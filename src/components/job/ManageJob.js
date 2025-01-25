"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  Chip,
  InputBase,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectJobState, deleteJob } from '../../redux/slices/jobSlice';

const JobDetailsModal = ({ job, open, onClose }) => {
  if (!job) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px !important',
          maxHeight: '90vh',
          minHeight: '80vh',
          width: '95%',
          m: 2,
          '& .MuiDialogContent-root': {
            padding: 0,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              background: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#e0e0e0',
              borderRadius: '24px',
              '&:hover': {
                background: '#bdbdbd'
              }
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
              margin: '4px'
            }
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Section with Company Logo */}
        <Box sx={{
          p: 4,
          pb: 3,
          background: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          backdropFilter: 'blur(8px)',
          flexShrink: 0
        }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              bgcolor: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.04)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <CloseIcon sx={{ color: '#666' }} />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                backgroundColor: '#1a97f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.4rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {job.jobTitle?.[0]?.toUpperCase() || 'J'}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #2c3e50, #3498db)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}>
                  {job.jobTitle}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  bgcolor: '#E3F2FD',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  border: '1px solid #90CAF9',
                  height: 'fit-content',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#BBDEFB',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }
                }}>
                  <Typography sx={{ 
                    color: '#1565C0',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px'
                  }}>
                    Job ID: {job.jobId}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkOutlineIcon fontSize="small" sx={{ color: '#4caf50' }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>{job.experience}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: '#9e9e9e' }} />
                  <Typography variant="body2" sx={{ color: '#666' }}>{job.jobCategory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#666'
                  }}>
                    💰 {job.salary}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content Section */}
        <DialogContent sx={{
          p: 0,
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            background: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#e0e0e0',
            borderRadius: '24px',
            '&:hover': {
              background: '#bdbdbd'
            }
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
            margin: '4px'
          }
        }}>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2.5,
                      fontWeight: 600,
                      color: '#2c3e50',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: '#4caf50',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    Job Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#555',
                      lineHeight: 1.8,
                      letterSpacing: '0.015em'
                    }}
                  >
                    {job.jobDescription}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2.5,
                      fontWeight: 600,
                      color: '#2c3e50',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: '#4caf50',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {job.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        sx={{
                          bgcolor: 'white',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '12px',
                          px: 1,
                          py: 2.5,
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#f5f5f5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    bgcolor: 'rgba(248,249,250,0.8)',
                    borderRadius: '16px',
                    p: 3,
                    mb: 3,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2.5,
                      fontWeight: 600,
                      color: '#2c3e50',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: '#4caf50',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    Job Overview
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <PersonOutlineIcon sx={{ color: '#4caf50' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Experience
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {job.experience}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <SupervisorAccountIcon sx={{ color: '#4caf50' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Vacancies
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {job.numberOfVacancies}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <AccessTimeIcon sx={{ color: '#9e9e9e' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Expires On
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {new Date(job.expiredDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box
                  sx={{
                    bgcolor: 'rgba(248,249,250,0.8)',
                    borderRadius: '16px',
                    p: 3,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2.5,
                      fontWeight: 600,
                      color: '#2c3e50',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 40,
                        height: 3,
                        backgroundColor: '#4caf50',
                        borderRadius: '4px'
                      }
                    }}
                  >
                    Additional Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Working Schedule
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {job.workingSchedule}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Interview Type
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {job.interviewType}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        transform: 'translateX(4px)',
                        transition: 'transform 0.2s ease'
                      }
                    }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {job.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

const ManageJob = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [filterOptions, setFilterOptions] = useState({
    jobCategory: '',
    experience: '',
    workingSchedule: ''
  });

  // Get state from Redux
  const { jobs = [], loading = false, error = null } = useSelector((state) => ({
    jobs: state.jobs.jobs || [],
    loading: state.jobs.loading?.jobs || false,
    error: state.jobs.error
  }));

  useEffect(() => {
    const loadJobs = async () => {
      try {
        await dispatch(fetchJobs()).unwrap();
      } catch (error) {
        console.error('Error loading jobs:', error);
      }
    };
    loadJobs();
  }, [dispatch]);

  // Debug log
  useEffect(() => {
    console.log('Current jobs state:', jobs);
  }, [jobs]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuClick = (event, job) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedJob(job);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleJobTitleClick = (job) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  const handleEditClick = () => {
    if (selectedJob) {
      handleMenuClose();
      router.push(`/edit-job/${selectedJob.jobId}`);
    }
  };

  const handleDeleteClick = () => {
    setJobToDelete(selectedJob);
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await dispatch(deleteJob(jobToDelete.jobId)).unwrap();
      setDeleteConfirmOpen(false);
      setJobToDelete(null);
      setSnackbar({
        open: true,
        message: 'Job deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete job. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setJobToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (sortType) => {
    setSortBy(sortType);
    handleSortClose();
  };

  const handleFilterChange = (type, value) => {
    setFilterOptions(prev => ({
      ...prev,
      [type]: value
    }));
    handleFilterClose();
  };

  // Get unique values for filters
  const getUniqueValues = (field) => {
    return [...new Set(jobs?.map(job => job[field]).filter(Boolean))];
  };

  // Apply filters and sorting
  const getFilteredAndSortedJobs = () => {
    let filtered = [...(jobs || [])];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobTitle?.toLowerCase().includes(term) ||
        job.jobDescription?.toLowerCase().includes(term) ||
        job.location?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filterOptions.jobCategory) {
      filtered = filtered.filter(job => job.jobCategory === filterOptions.jobCategory);
    }

    // Apply experience filter
    if (filterOptions.experience) {
      filtered = filtered.filter(job => job.experience === filterOptions.experience);
    }

    // Apply working schedule filter
    if (filterOptions.workingSchedule) {
      filtered = filtered.filter(job => job.workingSchedule === filterOptions.workingSchedule);
    }

    // Apply sorting
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));
        break;
      case 'titleAZ':
        filtered.sort((a, b) => (a.jobTitle || '').localeCompare(b.jobTitle || ''));
        break;
      case 'titleZA':
        filtered.sort((a, b) => (b.jobTitle || '').localeCompare(a.jobTitle || ''));
        break;
      default:
        break;
    }

    return filtered;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        mt: 2
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 800,
          color: '#333'
        }}>
          Job List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/create-job')}
          sx={{
            bgcolor: '#000',
            color: '#fff',
            borderRadius: '8px',
            textTransform: 'none',
            px: 3,
            py: 1,
            '&:hover': {
              bgcolor: '#333'
            }
          }}
        >
          New Job
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        gap: 2
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#fff',
          borderRadius: '12px',
          px: 2,
          py: 1,
          flex: 1,
          maxWidth: 400,
          border: '1px solid #eee'
        }}>
          <SearchIcon sx={{ color: '#999', mr: 1 }} />
          <InputBase
            placeholder="Search....."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              '& input': {
                color: '#666',
                '&::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* Filter Button */}
          <Box
            onClick={handleFilterClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              bgcolor: filterOptions.jobCategory || filterOptions.experience || filterOptions.workingSchedule ? '#E3F2FD' : 'transparent',
              px: 2,
              py: 1,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#F5F5F5' }
            }}
          >
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              Filters
            </Typography>
            <FilterListIcon sx={{ color: '#666', fontSize: '1.2rem' }} />
          </Box>

          {/* Sort Button */}
          <Box
            onClick={handleSortClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              px: 2,
              py: 1,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#F5F5F5' }
            }}
          >
            <Typography sx={{ color: '#666', fontSize: '0.9rem' }}>
              Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: '#666', fontSize: '1.2rem' }} />
          </Box>
        </Box>
      </Box>

      {/* Sort Menu */}
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              fontSize: '0.9rem',
              color: '#666',
              '&:hover': {
                bgcolor: '#F5F5F5'
              }
            }
          }
        }}
      >
        <MenuItem onClick={() => handleSortSelect('latest')}>Latest First</MenuItem>
        <MenuItem onClick={() => handleSortSelect('oldest')}>Oldest First</MenuItem>
        <MenuItem onClick={() => handleSortSelect('titleAZ')}>Title (A-Z)</MenuItem>
        <MenuItem onClick={() => handleSortSelect('titleZA')}>Title (Z-A)</MenuItem>
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '12px',
            minWidth: '200px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
              fontSize: '0.9rem',
              color: '#666',
              '&:hover': {
                bgcolor: '#F5F5F5'
              }
            }
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: '#333', mb: 1 }}>Job Category</Typography>
          <Select
            value={filterOptions.jobCategory}
            onChange={(e) => handleFilterChange('jobCategory', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {getUniqueValues('jobCategory').map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle2" sx={{ color: '#333', mb: 1 }}>Experience</Typography>
          <Select
            value={filterOptions.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          >
            <MenuItem value="">All Experience</MenuItem>
            {getUniqueValues('experience').map(exp => (
              <MenuItem key={exp} value={exp}>{exp}</MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle2" sx={{ color: '#333', mb: 1 }}>Working Schedule</Typography>
          <Select
            value={filterOptions.workingSchedule}
            onChange={(e) => handleFilterChange('workingSchedule', e.target.value)}
            fullWidth
            size="small"
          >
            <MenuItem value="">All Schedules</MenuItem>
            {getUniqueValues('workingSchedule').map(schedule => (
              <MenuItem key={schedule} value={schedule}>{schedule}</MenuItem>
            ))}
          </Select>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setFilterOptions({ jobCategory: '', experience: '', workingSchedule: '' })}
            sx={{
              mt: 2,
              bgcolor: '#000',
              color: '#fff',
              '&:hover': { bgcolor: '#333' },
              textTransform: 'none',
              borderRadius: '8px'
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Menu>

      {/* Jobs Grid */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress size={24} sx={{ color: '#666' }} />
            </Box>
          </Grid>
        ) : error ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <Typography sx={{ color: '#666' }}>
                {error}
              </Typography>
            </Box>
          </Grid>
        ) : getFilteredAndSortedJobs().length === 0 ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <Typography sx={{ color: '#666' }}>
                No jobs found
              </Typography>
            </Box>
          </Grid>
        ) : (
          getFilteredAndSortedJobs().map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id || job.jobId}>
              <Card sx={{
                height: '100%',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                }
              }} onClick={() => handleJobTitleClick(job)}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={job.companyLogo}
                        sx={{
                          width: 45,
                          height: 45,
                          bgcolor: job.companyLogo ? 'transparent' : '#E3F2FD',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          border: '2px solid #fff'
                        }}
                      >
                        {!job.companyLogo && job.jobTitle.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            color: '#1E293B',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            mb: 0.5
                          }}
                        >
                          {job.jobTitle}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 0.5,
                          bgcolor: '#F0F9FF',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '100px',
                          width: 'fit-content'
                        }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#0369A1',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              letterSpacing: '0.2px'
                            }}
                          >
                          Job-ID : {job.jobId} 
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuClick(e, job)}
                      sx={{
                        color: '#64748B',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          color: '#000',
                          transform: 'scale(1.1)',
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 2,
                    color: '#64748B',
                    fontSize: '0.85rem'
                  }}>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <AccessTimeIcon sx={{ fontSize: '0.9rem', color: '#3B82F6' }} />
                      <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
                        Posted: {new Date(job.publishDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#10B981',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        marginLeft: '2rem',
                        letterSpacing: '0.2px'
                      }}
                    >
                      {job.numberOfVacancies} Openings
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5,
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1
                      }}>
                        <AccessTimeIcon sx={{ color: '#8B5CF6', fontSize: '1rem' }} />
                        <Typography sx={{ 
                          color: '#64748B', 
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}>
                          {job.experience}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1
                      }}>
                        <WorkOutlineIcon sx={{ color: '#EC4899', fontSize: '1rem' }} />
                        <Typography sx={{ 
                          color: '#64748B', 
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}>
                          {job.workingSchedule}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: 2
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1
                      }}>
                        <AccountBalanceWalletOutlinedIcon sx={{ color: '#F59E0B', fontSize: '1rem' }} />
                        <Typography sx={{ 
                          color: '#64748B', 
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}>
                          {job.salary || 'Negotiable'}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1
                      }}>
                        <PersonOutlineIcon sx={{ color: '#10B981', fontSize: '1rem' }} />
                        <Typography sx={{ 
                          color: '#64748B', 
                          fontSize: '0.85rem',
                          fontWeight: 500
                        }}>
                          {job.jobRole}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={selectedJob}
        open={modalOpen}
        onClose={handleModalClose}
      />

      {/* Menu for job actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            minWidth: 150,
            borderRadius: '12px',
            '& .MuiList-root': {
              py: 0.5
            }
          }
        }}
        TransitionComponent={Fade}
        transitionDuration={200}
      >
        <MenuItem 
          onClick={handleEditClick}
          sx={{
            py: 1.5,
            px: 2,
            mx: 0.5,
            borderRadius: '8px',
            gap: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: '1.2rem', color: '#64748B' }} />
          <Typography sx={{ fontSize: '0.9rem' }}>Edit</Typography>
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteClick}
          sx={{
            py: 1.5,
            px: 2,
            mx: 0.5,
            borderRadius: '8px',
            gap: 1.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(244, 67, 54, 0.08)',
              color: '#F44336'
            }
          }}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '1.2rem', color: '#64748B' }} />
          <Typography sx={{ fontSize: '0.9rem' }}>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the job "{jobToDelete?.jobTitle}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2, pt: 0 }}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: '#ddd',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                bgcolor: 'transparent'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: '#dc2626',
              color: '#fff',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#b91c1c'
              }
            }}
          >
            Delete
          </Button>
        </Box>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            '& .MuiAlert-message': {
              fontSize: '0.95rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageJob;