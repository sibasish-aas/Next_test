'use client';
import React, { useState } from 'react';
import Header from './header/header';
import Sidebar from './sidebar/sidebar';
import { Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AttendanceStatusCard from '../components/AttendenceStatusCard';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const [sidebarMode, setSidebarMode] = useState('full');
  const checkInTime = useSelector((state) => state.attendance.checkInTime);
  const shift1CheckIn = useSelector((state) => state.attendance.shift1CheckIn);
  const shift1CheckOut = useSelector((state) => state.attendance.shift1CheckOut);
  const shift2CheckIn = useSelector((state) => state.attendance.shift2CheckIn);
  const shift2CheckOut = useSelector((state) => state.attendance.shift2CheckOut);


  const toggleSidebar = () => {
    setSidebarMode(prev => prev === 'full' ? 'mini' : 'full');
  };

  const sidebarWidth = {
    full: 260,
    mini: 65,
  };

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: '#f5f5f5'
    }}>
      <Box
        component={motion.div}
        initial={false}
        animate={{
          width: sidebarWidth[sidebarMode],
          transition: { duration: 0.3 }
        }}
        sx={{
          position: 'fixed',
          height: '100vh',
          zIndex: 1300,
          left: 0,
          top: 0,
        }}
      >
        <Sidebar mode={sidebarMode} />
      </Box>

      <Box
        component={motion.div}
        layout
        sx={{
          flexGrow: 1,
          marginLeft: `${sidebarWidth[sidebarMode]}px`,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1200,
        }}
      >
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
        }}>
          <Header toggleSidebar={toggleSidebar} sidebarMode={sidebarMode} />
        </Box>

        <Box sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1200,
        }}>
          <AnimatePresence>
            {checkInTime && <AttendanceStatusCard checkInTime={checkInTime}
              shift1CheckIn={shift1CheckIn}
              shift1CheckOut={shift1CheckOut}
              shift2CheckIn={shift2CheckIn}
              shift2CheckOut={shift2CheckOut} />}
          </AnimatePresence>
        </Box>

        <Box
          component={motion.div}
          layout
          sx={{
            flexGrow: 1,
            p: 3,
            overflowY: 'auto',
            bgcolor: '#f5f5f5',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
