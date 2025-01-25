require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const jobNoticeRouter = require('./routes/JobNoticeRouter');
const skillRoutes = require('./routes/skillRoute');
const jobRoutes = require('./routes/jobRoute');
const roundRoute = require('./routes/roundRoutes');
const validateToken = require('./middlewares/authMiddleware');
const interviewScheduleRoutes = require('./routes/interviewScheduleRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const applicantRoute = require('./routes/applicantRoute');
const offerletterRoutes = require('./routes/offerletterroutes');
const designationRoute = require('./routes/designationRoute');
const stateRoutes = require('./routes/stateRoutes');
const countryRoutes = require('./routes/countryRoutes');
const deparmentRoute = require('./routes/AttendanceRoutes/departmentRoutes');
const employeeRoute = require('./routes/AttendanceRoutes/employeeRouter');
const attendanceRoute = require('./routes/AttendanceRoutes/attendanceRoutes');
const leaveRoute = require('./routes/AttendanceRoutes/leaveRoute');
const performanceRoute = require('./routes/AttendanceRoutes/performanceRoute');
const leaveMasterRoute = require('./routes/AttendanceRoutes/leavemasterRoute');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://192.168.0.176:3000',
    // Add any other allowed origins here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Enable credentials (cookies, authorization headers, etc)
};

app.use(cors(corsOptions));

// API Routes prefix
const API_PREFIX = '/api/hrms';

// Auth routes (no token required)
app.use(API_PREFIX, authRoutes);

// Protected routes (token required)
const protectedRoutes = [
  { path: '/skills', router: skillRoutes },
  { path: '/job-notices', router: jobNoticeRouter },
  { path: '/jobs', router: jobRoutes },
  { path: '/rounds', router: roundRoute },
  { path: '/interview-schedules', router: interviewScheduleRoutes },
  { path: '/feedback', router: feedbackRoutes },
  { path: '/applicants', router: applicantRoute },
  { path: '/offer-letters', router: offerletterRoutes },
  { path: '/designations', router: designationRoute },
  { path: '/states', router: stateRoutes },
  { path: '/countries', router: countryRoutes },
  { path: '/departments', router: deparmentRoute },
  { path: '/employees', router: employeeRoute },
  { path: '/attendance', router: attendanceRoute },
  { path: '/leaves', router: leaveRoute },
  { path: '/performance', router: performanceRoute },
  { path: '/leave-master', router: leaveMasterRoute }
];

// Register protected routes
protectedRoutes.forEach(({ path, router }) => {
  app.use(API_PREFIX + path, validateToken, router);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://localhost:${PORT} and http://192.168.0.176:${PORT}`);
});
