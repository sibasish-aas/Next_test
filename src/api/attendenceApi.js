import axios from 'axios';
import { API_CONFIG } from '../api/apiConfig';

const BASE_URL = API_CONFIG.getBaseUrl();

// Add request interceptor to check for token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const attendenceApi = {
  // For AddAttendence component
  fetchEmployeeData: async (providedEmail) => {
    try {
      const email = providedEmail || localStorage.getItem('email');
      if (!email) {
        throw new Error('Email not found in localStorage');
      }

      console.log('Fetching employee data for email:', email);
      const response = await axios.post(`${BASE_URL}/fetchemployee`, { email });
      
      console.log('API Response:', response.data);

      const employeeData = response.data[0];
      
      if (!employeeData) {
        throw new Error('No employee data found');
      }

      return {
        employeeDetails: {
          id: employeeData._id,
          name: employeeData.name,
          email: employeeData.email,
          employee_id: employeeData.employee_id,
        },
        departmentDetails: {
          id: employeeData.department._id,
          department_name: employeeData.department.department_name,
          department_id: employeeData.department.department_id,
        },
        attendanceHistory: employeeData.Attendance.map(record => ({
          date: record.date,
          shift1_time_in: record.shift1_time_in,
          shift1_time_out: record.shift1_time_out,
          shift2_time_in: record.shift2_time_in,
          shift2_time_out: record.shift2_time_out,
          working_hours: record.working_hours,
          status: record.status
        }))
      };
    } catch (error) {
      console.error('Error in fetchEmployeeData:', error);
      throw error;
    }
  },

  // For AllAttendence component - Updated to handle nested data
  fetchAllAttendances: async () => {
    try {
      console.log('Fetching all attendances');
      const response = await axios.get(`${BASE_URL}/fetchattendance`);
      console.log('All attendances response:', response.data);
      
      // Transform the nested data
      const transformedData = response.data.map(record => ({
        id: record._id,
        // Employee details from nested object
        employee_name: record.employee?.name || 'N/A',
        employee_id: record.employee?.employee_id || 'N/A',
        employee_email: record.employee?.email || 'N/A',
        // Department details from nested object
        department_name: record.employee?.department?.department_name || 'N/A',
        department_id: record.employee?.department?.department_id || 'N/A',
        // Attendance details
        date: record.date || 'N/A',
        shift1_time_in: record.shift1_time_in || '-',
        shift1_time_out: record.shift1_time_out || '-',
        shift2_time_in: record.shift2_time_in || '-',
        shift2_time_out: record.shift2_time_out || '-',
        working_hours: record.working_hours || '0:00',
        status: record.status || 'N/A',
        attendance_id: record.attendance_id || 'N/A'
      }));

      console.log('Transformed attendance data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Error fetching all attendances:', error);
      throw error.response?.data || error.message || 'Failed to fetch attendance data';
    }
  },


  // Keep other API methods if needed
  shift1CheckIn: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/shift1punchin`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  shift1CheckOut: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/shift1punchout`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  shift2CheckIn: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/shift2punchin`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  shift2CheckOut: async (email) => {
    try {
      const response = await axios.post(`${BASE_URL}/shift2punchout`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAttendanceCSV: async (startDate, endDate) => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        throw new Error('Email not found in localStorage');
      }

      // Get employee data using existing endpoint
      const response = await axios.post(`${BASE_URL}/fetchemployee`, { email });
      const employeeData = response.data[0];
      
      if (!employeeData || !employeeData.Attendance) {
        throw new Error('No attendance data found');
      }

      // Filter attendance data by date range
      const filteredAttendance = employeeData.Attendance.filter(record => {
        const recordDate = new Date(record.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return recordDate >= start && recordDate <= end;
      });

      // Create CSV data
      const headers = ['Date', 'Shift 1 In', 'Shift 1 Out', 'Shift 2 In', 'Shift 2 Out', 'Working Hours', 'Status'];
      const csvRows = [headers];

      filteredAttendance.forEach(record => {
        csvRows.push([
          record.date,
          record.shift1_time_in || '',
          record.shift1_time_out || '',
          record.shift2_time_in || '',
          record.shift2_time_out || '',
          record.working_hours || '',
          record.status || ''
        ]);
      });

      // Convert to CSV string
      const csvData = csvRows.map(row => row.join(',')).join('\n');
      
      return { csvData };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default attendenceApi;