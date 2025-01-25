"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  ListItemIcon,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  PersonAdd as AddUserIcon,
  SupervisedUserCircle as UserIcon,
  People as ManageUsersIcon,
  PostAdd as CreateNoticeIcon,
  Visibility as ViewNoticeIcon,
  CheckCircle as ApprovalIcon,
  Work as RecruitmentIcon,
  AddBusiness as CreateJobIcon,
  // New icons for Attendance
  PunchClock as AttendanceMainIcon, // Changed: Main attendance icon
  HowToReg as AddAttendanceIcon, // Changed: Add attendance icon
  Assessment as AllAttendanceIcon, // Changed: View attendance icon
  // New icons for Leave
  EventNote as LeaveMainIcon, // Changed: Main leave icon
  NoteAdd as AddLeaveIcon, // Changed: Add leave icon
  FormatListNumbered as AllLeaveIcon,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";

const Sidebar = ({ mode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState({});
  const isMini = mode === "mini";

  useEffect(() => {
    setOpenMenu({
      users:
        pathname.includes("/add-users") || pathname.includes("/manage-users"),
      masters:
        pathname.includes("/manage-skill") ||
        pathname.includes("/manage-interview-rounds") ||
        pathname.includes("/manage-country"),
      recruitment:
        pathname.includes("/create-notice") ||
        pathname.includes("/notice-status") ||
        // pathname.includes("/view-notice-request") ||
        pathname.includes("/create-job") ||
        pathname.includes("/manage-job")||
        pathname.includes("/interview-schedule")||
        pathname.includes("/selected-candidates"),
      attendance:
        pathname.includes("/add-attendance") ||
        pathname.includes("/all-attendance"),
      leave: pathname.includes("/add-leave") || pathname.includes("/all-leave"),
      performance:
        pathname.includes("/work-report") || pathname.includes("/view-report"),
    });
  }, [pathname]);

  const toggleMenu = (e, menuName) => {
    e.preventDefault();
    setOpenMenu((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    router.push(path);
  };

  const isActive = (path) => pathname === path;

  const MenuItem = ({ path, icon, text }) => (
    <Tooltip title={isMini ? text : ""} placement="right">
      <ListItem
        button="true"
        onClick={(e) => handleNavigation(e, path)}
        sx={{
          mb: 0.5,
          borderRadius: 2,
          bgcolor: isActive(path) ? "rgba(255,255,255,0.1)" : "transparent",
          justifyContent: isMini ? "center" : "flex-start",
          px: isMini ? 1 : 2,
          "&:hover": {
            bgcolor: "rgba(255,255,255,0.08)",
            cursor: "pointer",
          },
          cursor: "pointer",
        }}
      >
        <Box
          sx={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: isMini ? "center" : "flex-start",
          }}
        >
          <ListItemIcon
            sx={{
              color: "white",
              minWidth: isMini ? 0 : 40,
            }}
          >
            {icon}
          </ListItemIcon>
          {!isMini && (
            <ListItemText
              primary={text}
              sx={{
                "& .MuiTypography-root": {
                  fontSize: "0.875rem",
                },
              }}
            />
          )}
        </Box>
      </ListItem>
    </Tooltip>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isMini ? 65 : 260,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isMini ? 65 : 260,
          boxSizing: "border-box",
          bgcolor: "#1a1a1a",
          color: "white",
          borderRight: "none",
          transition: "width 0.3s ease",
          overflowX: "hidden",
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          cursor: "pointer",
        },
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          p: isMini ? 1 : 3,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: isMini ? "center" : "flex-start",
          gap: 2,
          minHeight: 70,
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(26,26,26,0.9)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!isMini && (   
          <Typography>
            <img src="/logo-3.png" alt="Logo" style={{ width: "100px" }} />
          </Typography>
        )}
      </Box>

      <List sx={{ p: isMini ? 1 : 2 }}>
        {/* Dashboard */}
        <MenuItem path="/dashboard" icon={<DashboardIcon />} text="Dashboard" />

        {/* Masters Menu */}
        <Tooltip title={isMini ? "Masters" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "masters")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <RecruitmentIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Masters" />
                {openMenu.masters ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.masters} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/manage-skill",
                icon: <CreateNoticeIcon />,
                text: "Manage Skill",
              },
              {
                path: "/manage-interview-rounds",
                icon: <ApprovalIcon />,
                text: "Manage Interview Rounds",
              },
              {
                path: "/manage-country",
                icon: <ApprovalIcon />,
                text: "Manage Country",
              },
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>

        {/* Users */}
        <Tooltip title={isMini ? "Users" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "users")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <UserIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Users" />
                {openMenu.users ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.users} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/add-users",
                icon: <AddUserIcon />,
                text: "Add User",
              },
              {
                path: "/manage-users",
                icon: <ManageUsersIcon />,
                text: "Manage Users",
              },
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>

        {/* Recruitment Menu */}
        <Tooltip title={isMini ? "Recruitment" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "recruitment")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <RecruitmentIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Recruitment" />
                {openMenu.recruitment ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.recruitment} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/create-notice",
                icon: <CreateNoticeIcon />,
                text: "Create Notice",
              },
              // {
              //   path: "/view-notice-request",
              //   icon: <ViewNoticeIcon />,
              //   text: "View Notice Request",
              // },
              {
                path: "/notice-status",
                icon: <ApprovalIcon />,
                text: "Notice Status",
              },
              // {
              //   path: "/create-job",
              //   icon: <CreateJobIcon />,
              //   text: "Create Job",
              // },
              {
                path: "/manage-job",
                icon: <CreateJobIcon />,
                text: "Manage Jobs",
              },
              {
                path: "/jobapplication",
                icon: <CreateJobIcon />,
                text: "Applications ",
              },
              {
                path: "/interviewer",
                icon: <CreateJobIcon />,
                text: "Interviewer Pannel",
              },
              // {
              //   path: "/",
              //   icon: <CreateJobIcon />,
              //   text: "Selected Candidates",
              // },
             
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>

        <Tooltip title={isMini ? "Attendence" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "attendence")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <AttendanceMainIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Attendence" />
                {openMenu.attendance ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.attendence} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/add-attendence",
                icon: <AddAttendanceIcon />,
                text: "Add Attendence",
              },
              {
                path: "/all-attendence",
                icon: <AllAttendanceIcon />,
                text: "All Attendence",
              },
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>

        <Tooltip title={isMini ? "Leave" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "leave")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <LeaveMainIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Leave" />
                {openMenu.leave ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.leave} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/add-leave",
                icon: <AddLeaveIcon />,
                text: "Add Leave",
              },
              {
                path: "/all-leave",
                icon: <AllLeaveIcon />,
                text: "All Leave",
              },
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>

        {/* Performance Menu */}
        <Tooltip title={isMini ? "Performance" : ""} placement="right">
          <ListItem
            button="true"
            onClick={(e) => toggleMenu(e, "performance")}
            sx={{
              mb: 1,
              borderRadius: 2,
              justifyContent: isMini ? "center" : "flex-start",
              px: isMini ? 1 : 2,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: isMini ? 0 : 40 }}>
              <ApprovalIcon />
            </ListItemIcon>
            {!isMini && (
              <>
                <ListItemText primary="Performance" />
                {openMenu.performance ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
        </Tooltip>

        <Collapse in={openMenu.performance} timeout="auto" unmountOnExit>
          <List
            component="div"
            sx={{
              pl: isMini ? 0 : 2,
              ...(isMini && {
                position: "relative",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 1,
                mt: 1,
              }),
            }}
          >
            {[
              {
                path: "/work-report",
                icon: <CreateNoticeIcon />,
                text: "Work Report",
              },
              {
                path: "/view-report",
                icon: <ViewNoticeIcon />,
                text: "View Report",
              },
            ].map((item) => (
              <MenuItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
