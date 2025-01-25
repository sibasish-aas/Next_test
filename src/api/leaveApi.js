import axiosInstance from './axiosInstance';

// Helper function to get the token from localStorage or another source
const getAuthToken = () => {
  return localStorage.getItem('token');  // Adjust based on where you store the token
};

// Fetch all leave applications
export const fetchLeaveApplicationsApi = async () => {
  const token = getAuthToken();
  const response = await axiosInstance.get('/getleaves', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Fetch employee-specific leave applications
export const fetchEmployeeLeaveApplicationsApi = async (employeeId) => {
  const token = getAuthToken();
  //restore to end poitn "/getleaves or /getleavesbyemployee"
  const response = await axiosInstance.post(`/getleavesbyemployee/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(response.data);
  return response.data;
  // return response.data.filter(
  //   leaveRequest => leaveRequest.Employee.employee_id === employeeId
  // );
};

// Update leave status
export const updateLeaveStatusApi = async ({ EmployeeId, Leave_Id, Status }) => {
  const token = getAuthToken();
  const response = await axiosInstance.post('/updateleavestatus', {
    EmployeeId,
    Leave_Id,
    Status,
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
console.log("Leave Status Updated sucessfully",response.data)
  return response.data;
};

// Submit new leave request
export const submitLeaveRequestApi = async (formData) => {
  const token = getAuthToken();
  
  const form = new FormData();
  form.append("EmployeeId", formData.Employee);
  form.append("LeaveTitle", formData.LeaveTitle);
  form.append("LeaveType", formData.LeaveType);
  form.append("LeaveStartDate", formData.LeaveStartDate);
  form.append("LeaveEndDate", formData.LeaveEndDate);
  form.append("FromShift", formData.FromShift);
  form.append("ToShift", formData.ToShift);
  form.append("Description", formData.Description);
  if (formData.Attachment) {
    form.append("Attachment", formData.Attachment);
  }

  const response = await axiosInstance.post('/leaveapplication', form, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",  // Ensure correct content type
    },
  });
  console.log("Leave Request Send sucessfully",response.data)
  return response.data;
};


// Fetch employee data by email
export const fetchEmployeeByEmailApi = async () => {
  const email = localStorage.getItem('email');
  const token = getAuthToken();
  const response = await axiosInstance.post('/fetchemployee', { email }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Download attachment for leave request
export const downloadAttachmentApi = async (leaveRequestId) => {
  const token = getAuthToken();
  const response = await axiosInstance.get(`/downloadleaveatttachment/${leaveRequestId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  console.log("Attachment Downloaded  sucessfully");
  return response;
};


// Avilable Leaves is for Employee
export const getavailableleavesApi = async (employeeId) => {
  const token = getAuthToken();
    //console.log('Employee ID:', employeeId);
  const response = await axiosInstance.post(`/getavailableleaves/${employeeId}`,{
    //params: { employeeId }, // Pass the employeeId in query params
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  //console.log("Avilable Leaves is for Employee=",response.data)
  return response.data;
};
