
// import { useState } from 'react';
// import { TextField, Button, Grid } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { addTask } from '../../redux/slices/taskSlice';

// export default function TaskForm() {
//   const dispatch = useDispatch();
//   const [taskData, setTaskData] = useState({
//     TaskTitle: '',
//     TaskDescription: '',
//     StartDate: '',
//     StartTime: '',
//     EndDate: '',
//     EndTime: ''
//   });

//   const name = localStorage.getItem('fullname');

//   // Retrieve the email from localStorage (assuming the email is stored as 'email')
//   const email = localStorage.getItem('email'); // Ensure you store the email in localStorage when the user logs in

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData({
//       ...taskData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // If the email is available, add it to the task data
//     if (email) {
//       const taskWithEmail = { ...taskData, email: email, fullName : name };
//       // Dispatch the addTask action to the store
//       dispatch(addTask(taskWithEmail));

//       // Reset the form (optional)
//       setTaskData({
//         TaskTitle: '',
//         TaskDescription: '',
//         StartDate: '',
//         StartTime: '',
//         EndDate: '',
//         EndTime: ''
//       });
//     } else {
//       console.error('Email is not found in localStorage');
//     }
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5', // Light gray background for the page
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: 'white',
//           padding: '30px',
//           borderRadius: '10px',
//           maxWidth: '800px',
//           width: '100%', // Full width until maxWidth
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow for better visibility
//           marginTop: '10px',
//         }}
//       >
//         <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Fill Work Details</h2>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Task Title"
//             name="TaskTitle"
//             value={taskData.TaskTitle}
//             onChange={handleChange}
//             fullWidth
//             style={{ marginBottom: '20px' }}
//           />
//           <TextField
//             label="Task Description"
//             name="TaskDescription"
//             value={taskData.TaskDescription}
//             onChange={handleChange}
//             fullWidth
//             multiline
//             rows={4}
//             style={{ marginBottom: '20px' }}
//           />
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 name="StartDate"
//                 type="date"
//                 value={taskData.StartDate}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Time"
//                 name="StartTime"
//                 type="time"
//                 value={taskData.StartTime}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 name="EndDate"
//                 type="date"
//                 value={taskData.EndDate}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="End Time"
//                 name="EndTime"
//                 type="time"
//                 value={taskData.EndTime}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             {/* <Grid item xs={6}>
//               <TextField 
//                 name="fullName"
//                 type="hidden"
//                 value={name}
//                 style={{ display: 'none' }}
//               />
//             </Grid> */}
//           </Grid>
//           <div style={{ marginTop: '20px' }}>
//             <Button variant="contained" color="primary" type="submit" fullWidth>
//               Submit
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// import { useState } from 'react';
// import { TextField, Button, Grid } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { addTask } from '../../redux/slices/taskSlice';

// export default function TaskForm() {
//   const dispatch = useDispatch();
//   const [taskData, setTaskData] = useState({
//     TaskTitle: '',
//     TaskDescription: '',
//     StartDate: '',
//     StartTime: '',
//     EndDate: '',
//     EndTime: ''
//   });

//   const name = localStorage.getItem('fullname');

//   // Retrieve the email from localStorage (assuming the email is stored as 'email')
//   const email = localStorage.getItem('email'); // Ensure you store the email in localStorage when the user logs in

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTaskData({
//       ...taskData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // If the email is available, add it to the task data
//     if (email) {
//       const taskWithEmail = { ...taskData, email: email, fullName : name };
//       // Dispatch the addTask action to the store
//       dispatch(addTask(taskWithEmail));

//       // Reset the form (optional)
//       setTaskData({
//         TaskTitle: '',
//         TaskDescription: '',
//         StartDate: '',
//         StartTime: '',
//         EndDate: '',
//         EndTime: ''
//       });
//     } else {
//       console.error('Email is not found in localStorage');
//     }
//   };

//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5', // Light gray background for the page
//       }}
//     >
//       <div
//         style={{
//           backgroundColor: 'white',
//           padding: '30px',
//           borderRadius: '10px',
//           maxWidth: '800px',
//           width: '100%', // Full width until maxWidth
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow for better visibility
//           marginTop: '10px',
//         }}
//       >
//         <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Fill Work Details</h2>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Task Title"
//             name="TaskTitle"
//             value={taskData.TaskTitle}
//             onChange={handleChange}
//             fullWidth
//             style={{ marginBottom: '20px' }}
//           />
//           <TextField
//             label="Task Description"
//             name="TaskDescription"
//             value={taskData.TaskDescription}
//             onChange={handleChange}
//             fullWidth
//             multiline
//             rows={4}
//             style={{ marginBottom: '20px' }}
//           />
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Date"
//                 name="StartDate"
//                 type="date"
//                 value={taskData.StartDate}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="Start Time"
//                 name="StartTime"
//                 type="time"
//                 value={taskData.StartTime}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="End Date"
//                 name="EndDate"
//                 type="date"
//                 value={taskData.EndDate}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <TextField
//                 label="End Time"
//                 name="EndTime"
//                 type="time"
//                 value={taskData.EndTime}
//                 onChange={handleChange}
//                 fullWidth
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Grid>
//             {/* <Grid item xs={6}>
//               <TextField 
//                 name="fullName"
//                 type="hidden"
//                 value={name}
//                 style={{ display: 'none' }}
//               />
//             </Grid> */}
//           </Grid>
//           <div style={{ marginTop: '20px' }}>
//             <Button variant="contained" color="primary" type="submit" fullWidth>
//               Submit
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/slices/taskSlice';

export default function TaskForm() {
  const dispatch = useDispatch();
  const [taskData, setTaskData] = useState({
    TaskTitle: '',
    TaskDescription: '',
    StartDate: '',
    StartTime: '',
    EndDate: '',
    EndTime: ''
  });
  
  const [message, setMessage] = useState(null); // To store success or error message
  
  const name = localStorage.getItem('fullname');
  const email = localStorage.getItem('email'); // Ensure the email is stored in localStorage when the user logs in

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (email) {
      const taskWithEmail = { ...taskData, email: email, fullName: name };
      
      try {
        // Dispatch the addTask action to the store
        dispatch(addTask(taskWithEmail));
        
        // Reset the form
        setTaskData({
          TaskTitle: '',
          TaskDescription: '',
          StartDate: '',
          StartTime: '',
          EndDate: '',
          EndTime: ''
        });

        // Set success message
        setMessage({ type: 'success', text: 'Task successfully added!' });

        // Optionally show an alert
        // alert('Task successfully added!');
      } catch (error) {
        // Set error message
        setMessage({ type: 'error', text: 'An error occurred while adding the task.' });

        // Optionally show an alert
        // alert('An error occurred while adding the task.');
      }
    } else {
      setMessage({ type: 'error', text: 'Email not found in localStorage!' });
      // alert('Email not found in localStorage!');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Light gray background for the page
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '800px',
          width: '100%', // Full width until maxWidth
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Add shadow for better visibility
          marginTop: '10px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Fill Work Details</h2>
        <form onSubmit={handleSubmit}>
          {message && (
            <div
              style={{
                padding: '10px',
                marginBottom: '20px',
                backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24',
                borderRadius: '5px',
                border: message.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
              }}
            >
              {message.text}
            </div>
          )}
          <TextField
            label="Task Title"
            name="TaskTitle"
            value={taskData.TaskTitle}
            onChange={handleChange}
            fullWidth
            style={{ marginBottom: '20px' }}
          />
          <TextField
            label="Task Description"
            name="TaskDescription"
            value={taskData.TaskDescription}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            style={{ marginBottom: '20px' }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Start Date"
                name="StartDate"
                type="date"
                value={taskData.StartDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Start Time"
                name="StartTime"
                type="time"
                value={taskData.StartTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Date"
                name="EndDate"
                type="date"
                value={taskData.EndDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="End Time"
                name="EndTime"
                type="time"
                value={taskData.EndTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
