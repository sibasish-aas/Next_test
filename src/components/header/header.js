import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  Avatar,
  Box,
  Button,
  InputBase,
  Badge,
  Tooltip,
  Paper,
  Popper,
  ClickAwayListener,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Fade,
} from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { styled, alpha } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

// Styled components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'scrolled', // Prevent 'scrolled' from being passed to the DOM
})(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? alpha('#FFFDEC', 0.85) : '#FFFDEC',
  color: 'black',
  boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
  borderBottom: '1px solid',
  borderColor: alpha(theme.palette.common.black, 0.06),
  backdropFilter: scrolled ? 'blur(10px)' : 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  zIndex: 1200,
}));

const Search = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isExpanded', 
})(({ theme, isExpanded }) => ({
  position: 'relative',
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.common.black, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.06),
    cursor: 'pointer'
  },
  width: isExpanded ? '300px' : '45px',
  height: '40px',
  marginRight: theme.spacing(1),
  transition: 'width 0.3s ease-in-out',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isExpanded', 
})(({ theme, isExpanded }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.black, 0.54),
  zIndex: 1,
  left: isExpanded ? 0 : '50%',
  transform: isExpanded ? 'none' : 'translateX(-50%)',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '& svg': {
    cursor: 'pointer'
  }
}));

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})(({ theme, isExpanded }) => ({
  color: 'inherit',
  width: '100%',
  opacity: isExpanded ? 1 : 0,
  transition: 'opacity 0.2s ease-in-out',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    fontSize: '0.875rem',
  },
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  width: 300,
  backgroundColor: '#fff',
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
}));

const SearchResultsPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1301,
  width: '400px',
  borderRadius: '12px',
  marginTop: '8px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
}));

const SearchResultsPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: '#fff',
  overflow: 'hidden',
}));

const ResultSection = styled(Box)(({ theme }) => ({
  '&:not(:last-child)': {
    borderBottom: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
  },
}));

const ResultItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.04),
    cursor: 'pointer',
  },
}));

const NotificationPopper = styled(Popper)(({ theme }) => ({
  zIndex: 1301,
  width: '400px',
  borderRadius: '12px',
  marginTop: '8px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
}));

const NotificationPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  backgroundColor: '#fff',
  overflow: 'hidden',
  maxHeight: '500px',
  overflowY: 'auto',
}));

const NotificationItem = styled(ListItem)(({ theme, isRead }) => ({
  padding: theme.spacing(2),
  backgroundColor: isRead ? 'transparent' : alpha(theme.palette.primary.main, 0.04),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.04),
    cursor: 'pointer',
  },
  borderBottom: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
}));

const menuItems = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    category: 'main'
  },
  {
    title: 'Masters',
    category: 'masters',
    icon: <SettingsIcon />,
    items: [
      { title: 'Manage Skill', path: '/manage-skill', icon: <BusinessIcon /> },
      { title: 'Manage Interview Rounds', path: '/manage-interview-rounds', icon: <AssignmentIcon /> },
      { title: 'Manage Country', path: '/manage-country', icon: <BusinessIcon /> },
      { title: 'Manage State', path: '/manage-state', icon: <BusinessIcon /> }
    ]
  },
  {
    title: 'Users',
    category: 'users',
    icon: <PersonIcon />,
    items: [
      { title: 'Add User', path: '/add-users', icon: <PersonAddIcon /> },
      { title: 'Manage Users', path: '/manage-users', icon: <PeopleIcon /> }
    ]
  },
  {
    title: 'Recruitment',
    category: 'recruitment',
    icon: <WorkIcon />,
    items: [
      { title: 'Create Notice', path: '/create-notice', icon: <AssignmentIcon /> },
      { title: 'Notice Status', path: '/notice-status', icon: <AssessmentIcon /> },
      { title: 'Create Job', path: '/create-job', icon: <WorkIcon /> },
      { title: 'Manage Jobs', path: '/manage-job', icon: <WorkIcon /> },
      { title: 'Interview Schedule', path: '/interview-schedule', icon: <AccessTimeIcon /> },
      { title: 'Selected Candidates', path: '/selected-candidates', icon: <PeopleIcon /> }
    ]
  },
  {
    title: 'Attendance',
    category: 'attendance',
    icon: <AccessTimeIcon />,
    items: [
      { title: 'Add Attendance', path: '/add-attendance', icon: <AssignmentIcon /> },
      { title: 'All Attendance', path: '/all-attendance', icon: <AssessmentIcon /> }
    ]
  },
  {
    title: 'Leave',
    category: 'leave',
    icon: <EventNoteIcon />,
    items: [
      { title: 'Add Leave', path: '/add-leave', icon: <AssignmentIcon /> },
      { title: 'All Leave', path: '/all-leave', icon: <AssessmentIcon /> }
    ]
  },
  {
    title: 'Performance',
    category: 'performance',
    icon: <AssessmentIcon />,
    items: [
      { title: 'Work Report', path: '/work-report', icon: <AssignmentIcon /> },
      { title: 'View Report', path: '/view-report', icon: <AssessmentIcon /> }
    ]
  }
];

const Header = ({ toggleSidebar, sidebarMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "Guest");
    setRole(localStorage.getItem("role") || "User");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Fetch notifications on mount and every 30 seconds
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      // This should be replaced with your actual API call
      const mockNotifications = [
        {
          id: 1,
          type: 'leave_request',
          title: 'New Leave Request',
          message: 'John Doe requested 3 days of sick leave',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          isRead: false,
          priority: 'high',
          actionPath: '/all-leave',
          actionRequired: true,
        },
        {
          id: 2,
          type: 'interview',
          title: 'Interview Scheduled',
          message: 'Technical round for Senior Developer position at 2 PM',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          isRead: false,
          priority: 'medium',
          actionPath: '/interview-schedule',
          actionRequired: true,
        },
        {
          id: 3,
          type: 'attendance',
          title: 'Missing Attendance',
          message: 'You haven\'t marked your attendance for today',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          isRead: true,
          priority: 'low',
          actionPath: '/add-attendance',
          actionRequired: true,
        },
        {
          id: 4,
          type: 'notice',
          title: 'New Company Notice',
          message: 'Important update regarding work from home policy',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          isRead: true,
          priority: 'medium',
          actionPath: '/notice-status',
          actionRequired: false,
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("fullname");
    router.push("/");
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const menuSearchResults = [];
      
      menuItems.forEach(menu => {
        // Search in main menu items
        if (menu.path && menu.title.toLowerCase().includes(query.toLowerCase())) {
          menuSearchResults.push({
            id: menu.path,
            title: menu.title,
            path: menu.path,
            icon: menu.icon,
            category: menu.category,
            isMainMenu: true
          });
        }
        
        // Search in submenu items
        if (menu.items) {
          menu.items.forEach(item => {
            if (item.title.toLowerCase().includes(query.toLowerCase())) {
              menuSearchResults.push({
                id: item.path,
                title: item.title,
                path: item.path,
                icon: item.icon,
                category: menu.category,
                parentTitle: menu.title,
                isMainMenu: false
              });
            }
          });
        }
      });

      // Combine with other search results
      const results = {
        menuItems: menuSearchResults,
        users: [
          { id: 1, name: "John Doe", role: "Developer" },
          { id: 2, name: "Jane Smith", role: "Manager" },
        ].filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.role.toLowerCase().includes(query.toLowerCase())
        ),
        jobs: [
          { id: 1, title: "Senior Developer", department: "Engineering" },
          { id: 2, title: "Project Manager", department: "Management" },
        ].filter(job => 
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.department.toLowerCase().includes(query.toLowerCase())
        ),
        leaves: [
          { id: 1, type: "Sick Leave", status: "Pending" },
          { id: 2, type: "Vacation", status: "Approved" },
        ].filter(leave => 
          leave.type.toLowerCase().includes(query.toLowerCase()) ||
          leave.status.toLowerCase().includes(query.toLowerCase())
        ),
        notices: [
          { id: 1, title: "Company Meeting", date: "2024-01-25" },
          { id: 2, title: "Holiday Notice", date: "2024-01-26" },
        ].filter(notice => 
          notice.title.toLowerCase().includes(query.toLowerCase())
        ),
      };

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (type, item) => {
    setIsSearchExpanded(false);
    setSearchResults(null);
    setSearchQuery("");

    if (type === 'menuItems') {
      router.push(item.path);
      return;
    }

    // Navigate based on result type
    switch (type) {
      case 'users':
        router.push(`/manage-users?id=${item.id}`);
        break;
      case 'jobs':
        router.push(`/manage-job?id=${item.id}`);
        break;
      case 'leaves':
        router.push(`/all-leave?id=${item.id}`);
        break;
      case 'notices':
        router.push(`/notice-status?id=${item.id}`);
        break;
      default:
        break;
    }
  };

  const handleNotificationClick = (event) => {
    event.stopPropagation();
    setNotificationAnchorEl(notificationRef.current);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationItemClick = async (notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        // Replace with your API call to mark notification as read
        const updatedNotifications = notifications.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifications);
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to the relevant page
    if (notification.actionPath) {
      router.push(notification.actionPath);
    }
    
    handleNotificationClose();
  };

  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case 'leave_request':
        return <EventNoteIcon color={priority === 'high' ? 'error' : 'inherit'} />;
      case 'interview':
        return <AccessTimeIcon color={priority === 'high' ? 'error' : 'inherit'} />;
      case 'attendance':
        return <ErrorOutlineIcon color={priority === 'high' ? 'error' : 'inherit'} />;
      case 'notice':
        return <AssignmentIcon color={priority === 'high' ? 'error' : 'inherit'} />;
      default:
        return <NotificationsIcon color={priority === 'high' ? 'error' : 'inherit'} />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp)) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const sections = [
      { key: 'menuItems', title: 'Menu Items', icon: <MenuIcon />, items: searchResults.menuItems },
      { key: 'users', title: 'Users', icon: <PersonIcon />, items: searchResults.users },
      { key: 'jobs', title: 'Jobs', icon: <WorkIcon />, items: searchResults.jobs },
      { key: 'leaves', title: 'Leaves', icon: <EventNoteIcon />, items: searchResults.leaves },
      { key: 'notices', title: 'Notices', icon: <AssignmentIcon />, items: searchResults.notices },
    ];

    return (
      <SearchResultsPaper>
        {sections.map(({ key, title, icon, items }) => 
          items && items.length > 0 && (
            <ResultSection key={key}>
              <Typography
                variant="subtitle2"
                sx={{ px: 2, py: 1, bgcolor: alpha('#000', 0.02) }}
              >
                {title}
              </Typography>
              <List dense disablePadding>
                {items.map((item) => (
                  <ResultItem
                    key={item.id}
                    onClick={() => handleResultClick(key, item)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name || item.title || item.type}
                      secondary={item.role || item.department || item.status || item.date || (item.parentTitle ? `${item.parentTitle} > ${item.title}` : item.title)}
                    />
                  </ResultItem>
                ))}
              </List>
            </ResultSection>
          )
        )}
        {Object.values(searchResults).every(arr => !arr?.length) && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No results found for "{searchQuery}"
            </Typography>
          </Box>
        )}
      </SearchResultsPaper>
    );
  };





  // const renderNotifications = () => (
  //   <NotificationPaper>
  //     <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
  //       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  //         <Typography variant="h6" sx={{ fontSize: '1rem' }}>
  //           Notifications
  //         </Typography>
  //         {unreadCount > 0 && (
  //           <Button
  //             size="small"
  //             startIcon={<DoneAllIcon />}
  //             onClick={async () => {
  //               // Replace with your API call to mark all as read
  //               const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
  //               setNotifications(updatedNotifications);
  //               setUnreadCount(0);
  //             }}
  //           >
  //             Mark all as read
  //           </Button>
  //         )}
  //       </Box>
  //     </Box>
  //     <List sx={{ py: 0 }}>
  //       {notifications.length > 0 ? (
  //         notifications.map((notification) => (
  //           <NotificationItem
  //             key={notification.id}
  //             isRead={notification.isRead}
  //             onClick={() => handleNotificationItemClick(notification)}
  //           >
  //             <ListItemIcon sx={{ minWidth: 40 }}>
  //               {getNotificationIcon(notification.type, notification.priority)}
  //             </ListItemIcon>
  //             <ListItemText
  //               primary={notification.title}
  //               secondary={
  //                 <React.Fragment>
  //                   <Typography
  //                     component="span"
  //                     variant="body2"
  //                     color="text.primary"
  //                     sx={{ display: 'block', mb: 0.5 }}
  //                   >
  //                     {notification.message}
  //                   </Typography>
  //                   <Typography
  //                     component="span"
  //                     variant="caption"
  //                     color="text.secondary"
  //                   >
  //                     {formatTimeAgo(notification.timestamp)}
  //                     {notification.actionRequired && ' • Action required'}
  //                   </Typography>
  //                 </React.Fragment>
  //               }
  //             />
  //             {!notification.isRead && (
  //               <Box
  //                 sx={{
  //                   width: 8,
  //                   height: 8,
  //                   borderRadius: '50%',
  //                   bgcolor: 'primary.main',
  //                   ml: 1
  //                 }}
  //               />
  //             )}
  //           </NotificationItem>
  //         ))
  //       ) : (
  //         <Box sx={{ p: 3, textAlign: 'center' }}>
  //           <Typography color="text.secondary">
  //             No notifications
  //           </Typography>
  //         </Box>
  //       )}
  //     </List>
  //   </NotificationPaper>
  //  );






  return (
    <StyledAppBar position="relative" scrolled={scrolled}>
      <Toolbar sx={{ height: '70px' }}>
        <IconButton
          edge="start"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            color: 'black',
            transition: 'transform 0.3s ease',
            transform: sidebarMode === 'mini' ? 'rotate(180deg)' : 'rotate(0deg)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          {sidebarMode === 'mini' ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ClickAwayListener onClickAway={() => {
            setIsSearchExpanded(false);
            setSearchResults(null);
          }}>
            <Box>
              <Search 
                ref={searchRef}
                isExpanded={isSearchExpanded} 
                onClick={() => setIsSearchExpanded(true)}
              >
                <SearchIconWrapper isExpanded={isSearchExpanded}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search users, jobs, leaves..."
                  inputProps={{ 'aria-label': 'search' }}
                  isExpanded={isSearchExpanded}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsSearchExpanded(false);
                      setSearchResults(null);
                    }
                  }}
                />
                {isLoading && (
                  <Box sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
                    <CircularProgress size={20} />
                  </Box>
                )}
              </Search>
              <SearchResultsPopper
                open={Boolean(searchResults)}
                anchorEl={searchRef.current}
                placement="bottom-end"
              >
                {renderSearchResults()}
              </SearchResultsPopper>
            </Box>
          </ClickAwayListener>

          <Tooltip title="Notifications">
            <IconButton
              ref={notificationRef}
              onClick={handleNotificationClick}
              sx={{
                color: 'black',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FF4842',
                    color: 'white',
                    minWidth: '18px',
                    height: '18px',
                    fontSize: '0.75rem',
                  },
                }}
              >
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>








          {/* <NotificationPopper
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            placement="bottom-end"
            transition
          > */}
            {/* {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <div>{renderNotifications()}</div>
              </Fade>
            )}
          </NotificationPopper> */}













          <Tooltip title="Account settings">
            <IconButton 
              onClick={handleMenuOpen}
              sx={{
                color: 'black',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <PersonOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <ProfileCard>
            <Box sx={{ 
              p: 2, 
              backgroundImage: 'linear-gradient(135deg, #f6f8fa 0%, #f0f2f5 100%)',
              borderRadius: 2,
              mb: 2
            }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Welcome back
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Username
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#2c3e50',
                      fontSize: '1rem'
                    }}
                  >
                    {username}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Role
                  </Typography>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#2c3e50',
                      fontSize: '1rem'
                    }}
                  >
                    {role}
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                bgcolor: 'black',
                color: 'white',
                py: 1,
                '&:hover': {
                  bgcolor: alpha('#000', 0.8),
                },
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Logout
            </Button>
          </ProfileCard>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
