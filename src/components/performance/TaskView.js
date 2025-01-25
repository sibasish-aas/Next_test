// import { useEffect, useState } from 'react';
// import { Card, CardContent, Typography, Button, Modal, Box, Avatar, Grid, IconButton } from '@mui/material';
// import { Close as CloseIcon } from '@mui/icons-material'
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTasks, fetchTasksByEmail } from '../../redux/slices/taskSlice';
// import TaskDetailsModal from './TaskDetailsModal';
// import { format } from 'date-fns';

// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';  // Import Calendar icon
// import AccessTimeIcon from '@mui/icons-material/AccessTime';  // Import Clock icon

// export default function TaskView() {
//   const dispatch = useDispatch();
//   const { tasks, status, error } = useSelector((state) => state.tasks);
//   const [open, setOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);

//   const role = localStorage.getItem('role');

//   useEffect(() => {
//     if (status === 'idle') {
//       if (role === 'CPC') {
//         dispatch(fetchTasks());
//       } else {
//         dispatch(fetchTasksByEmail());
//       }
//     }
//   }, [dispatch, status]);

//   const handleOpen = (task) => {
//     setSelectedTask(task);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedTask(null);
//   };

//   // Ensure that tasks is an array before calling map
//   const taskList = Array.isArray(tasks) ? tasks : [];

//   // Log StartTime and EndTime for each task
//   taskList.forEach((task) => {
//     // console.log('StartTime:', task.StartTime);
//     // console.log('EndTime:', task.EndTime);
//   });

//   if (status === 'loading') return <div>Loading...</div>;
//   if (status === 'failed') return <div>Error: {error}</div>;

//   return (
//     <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    
//   <h1 style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold' }}>View WorkDetails</h1>

//   <Grid container spacing={3}>
//     {taskList.length === 0 ? (
//       <Typography>No tasks available</Typography>
//     ) : (
//       taskList.map((task) => (
//         <Grid item key={task.Taskid} xs={12} sm={6} md={4} lg={4}>
//           <Card
//             style={{
//               height: 'auto',
//               display: 'flex',
//               flexDirection: 'row', // Use row direction for two sides
//               justifyContent: 'flex-start',
//               padding: '15px',
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding a subtle shadow for depth
//               borderRadius: '8px', // Rounded corners
//             }}
//           >
//             {/* Left side (Profile section) */}
//             <div
//               style={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 marginRight: '15px', // Space between left and right sections
//               }}
//             >
//               <Avatar style={{ width: '60px', height: '60px' }}>
//                 {task.fullName ? task.fullName[0] : 'A'}
//               </Avatar>
//               <Typography
//                 variant="h6"
//                 style={{
//                   marginTop: '10px',
//                   textAlign: 'center',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 {task.fullName || 'No Name'}
//               </Typography>
//             </div>

//             {/* Right side (Task details section) */}
//             <div
//               style={{
//                 flex: 2,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 paddingLeft: '10px',
//               }}
//             >
//               <Typography variant="h6" style={{ fontWeight: 'bold' }}>
//                 {task.TaskTitle}
//               </Typography>

//               {/* Task details (start & end date, time) */}
//               <div style={{ marginTop: '10px' }}>
//                 {task.StartDate && task.EndDate && (
//                   <div style={{ display: 'flex', alignItems: 'center' }}>
//                     <IconButton size="small">
//                       <CalendarTodayIcon />
//                     </IconButton>
//                     <Typography variant="body2" color="textSecondary" style={{ marginRight: '10px' }}>
//                       {format(new Date(task.StartDate), 'MM/dd/yyyy')} - {format(new Date(task.EndDate), 'MM/dd/yyyy')}
//                     </Typography>
//                   </div>
//                 )}
//                 {task.StartTime && task.EndTime ? (
//                   <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
//                     <IconButton size="small">
//                       <AccessTimeIcon />
//                     </IconButton>
//                     <Typography variant="body2" color="textSecondary" style={{ marginRight: '10px' }}>
//                       {task.StartTime} - {task.EndTime}
//                     </Typography>
//                   </div>
//                 ) : (
//                   <Typography color="error" style={{ marginTop: '5px' }}>
//                     Time data is missing or invalid
//                   </Typography>
//                 )}
//               </div>

//               {/* View Button */}
//               <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
//                 <Button onClick={() => handleOpen(task)} variant="contained" color="primary">
//                   View
//                 </Button>
//               </div>
//             </div>
//           </Card>
//         </Grid>
//       ))
//     )}
//   </Grid>

//   {/* Modal for task details */}
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         style={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)', // This centers the modal horizontally and vertically
//         padding: '20px',
//         backgroundColor: 'white',
//         maxWidth: '600px',
//         width: '100%', // Ensure the modal content doesn't overflow
//         borderRadius: '8px', // Optional: to give the modal rounded corners
//       }}
//       >
//         {/* Close Button */}
//         <IconButton
//           onClick={handleClose}
//           style={{
//             position: 'absolute',
//             top: '10px',
//             right: '10px',
//             color: '#333', // Adjust color as needed
//           }}
//         >
//           <CloseIcon />
//         </IconButton>

//         {/* Task Details Modal */}
//         <TaskDetailsModal task={selectedTask} />
//       </Box>
//     </Modal>
//   </div>

//   );
// }


import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Modal, Box, Avatar, Grid, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchTasksByEmail } from '../../redux/slices/taskSlice';
import TaskDetailsModal from './TaskDetailsModal';
import { format } from 'date-fns';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';  // Import Calendar icon
import AccessTimeIcon from '@mui/icons-material/AccessTime';  // Import Clock icon

export default function TaskView() {
  const dispatch = useDispatch();
  const { tasks, status, error } = useSelector((state) => state.tasks);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const role = localStorage.getItem('role');

  useEffect(() => {
    if (status === 'idle') {
      if (role === 'CPC' || role === 'Super Admin' || role === 'Admin') {
        dispatch(fetchTasks());
      } else {
        dispatch(fetchTasksByEmail());
      }
    }
  }, [dispatch, status]);

  const handleOpen = (task) => {
    setSelectedTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  // Ensure that tasks is an array before calling map
  const taskList = Array.isArray(tasks) ? tasks : [];

  // Log StartTime and EndTime for each task
  taskList.forEach((task) => {
    // console.log('StartTime:', task.StartTime);
    // console.log('EndTime:', task.EndTime);
  });

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    
  <h1 style={{ fontSize: '1.5rem', color: '#333', fontWeight: 'bold', paddingBottom: '20px' }}>Work Details</h1>

  <Grid container spacing={3}>
    {taskList.length === 0 ? (
      <Typography>No tasks available</Typography>
    ) : (
      taskList.map((task) => (
        <Grid item key={task.Taskid} xs={12} sm={6} md={4} lg={4}>
          <Card
            style={{
              height: 'auto',
              display: 'flex',
              flexDirection: 'row', // Use row direction for two sides
              justifyContent: 'flex-start',
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adding a subtle shadow for depth
              borderRadius: '8px', // Rounded corners
            }}
          >
            {/* Left side (Profile section) */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px', // Space between left and right sections
              }}
            >
              <Avatar style={{ width: '60px', height: '60px' }}>
                {task.fullName ? task.fullName[0] : 'A'}
              </Avatar>
              <Typography
                variant="h6"
                style={{
                  marginTop: '10px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                {task.fullName || 'No Name'}
              </Typography>
            </div>

            {/* Right side (Task details section) */}
            <div
              style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                paddingLeft: '10px',
              }}
            >
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {task.TaskTitle}
              </Typography>

              {/* Task details (start & end date, time) */}
              <div style={{ marginTop: '10px' }}>
                {task.StartDate && task.EndDate && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small">
                      <CalendarTodayIcon />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" style={{ marginRight: '10px' }}>
                      {format(new Date(task.StartDate), 'MM/dd/yyyy')} - {format(new Date(task.EndDate), 'MM/dd/yyyy')}
                    </Typography>
                  </div>
                )}
                {task.StartTime && task.EndTime ? (
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <IconButton size="small">
                      <AccessTimeIcon />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary" style={{ marginRight: '10px' }}>
                      {task.StartTime} - {task.EndTime}
                    </Typography>
                  </div>
                ) : (
                  <Typography color="error" style={{ marginTop: '5px' }}>
                    Time data is missing or invalid
                  </Typography>
                )}
              </div>

              {/* View Button */}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => handleOpen(task)} variant="contained" color="primary">
                  View
                </Button>
              </div>
            </div>
          </Card>
        </Grid>
      ))
    )}
  </Grid>

  {/* Modal for task details */}
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // This centers the modal horizontally and vertically
        padding: '20px',
        backgroundColor: 'white',
        maxWidth: '600px',
        width: '100%', // Ensure the modal content doesn't overflow
        borderRadius: '8px', // Optional: to give the modal rounded corners
      }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#333', // Adjust color as needed
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Task Details Modal */}
        <TaskDetailsModal task={selectedTask} />
      </Box>
    </Modal>
  </div>

  );
}
