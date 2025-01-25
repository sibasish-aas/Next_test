
// import { Typography, Button, Rating } from '@mui/material';
// import { Event, AccessTime } from '@mui/icons-material';
// import { Box } from '@mui/material';
// import { format } from 'date-fns';  // Importing to format date and time

// export default function TaskDetailsModal({ task }) {
//   // Ensure task data is available
//   if (!task) return null;

//   // Format the dates
//   const formattedStartDate = task.StartDate ? format(new Date(task.StartDate), 'MM/dd/yyyy') : '';
//   const formattedEndDate = task.EndDate ? format(new Date(task.EndDate), 'MM/dd/yyyy') : '';
//   const formattedStartTime = task.StartTime ? task.StartTime : '';
//   const formattedEndTime = task.EndTime ? task.EndTime : '';

//   return (
//     <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
//       {/* Task Title */}
//       <Typography variant="h5" style={{ fontWeight: '600', color: '#333' }}>
//         {task.TaskTitle}
//       </Typography>

//       {/* Display Start and End Date & Time (under Title) */}
//       <Box style={{ marginTop: '15px' }}>
//         <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
//           <Event style={{ marginRight: '8px', color: '#3f51b5' }} />
//           <Typography variant="body2" color="textSecondary">
//              {formattedStartDate} - {formattedEndDate}
//           </Typography>
//         </Box>
        
//         <Box style={{ display: 'flex', alignItems: 'center' }}>
//           <AccessTime style={{ marginRight: '8px', color: '#3f51b5' }} />
//           <Typography variant="body2" color="textSecondary">
//             {formattedStartTime} - {formattedEndTime}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Task Description */}
//       <Typography style={{ marginTop: '20px', color: '#555', lineHeight: '1.6' }}>
//         {task.TaskDescription}
//       </Typography>

//       {/* Additional Styling for Spacing */}
//       <div style={{ marginTop: '30px' }}></div>
//     </div>
//   );
// }




import { Typography, Button, Rating } from '@mui/material';
import { Event, AccessTime } from '@mui/icons-material';
import { Box } from '@mui/material';
import { format } from 'date-fns';  // Importing to format date and time

export default function TaskDetailsModal({ task }) {
  // Ensure task data is available
  if (!task) return null;

  // Format the dates
  const formattedStartDate = task.StartDate ? format(new Date(task.StartDate), 'MM/dd/yyyy') : '';
  const formattedEndDate = task.EndDate ? format(new Date(task.EndDate), 'MM/dd/yyyy') : '';
  const formattedStartTime = task.StartTime ? task.StartTime : '';
  const formattedEndTime = task.EndTime ? task.EndTime : '';

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      {/* Task Title */}
      <Typography variant="h5" style={{ fontWeight: '600', color: '#333' }}>
        {task.TaskTitle}
      </Typography>

      {/* Display Start and End Date & Time (under Title) */}
      <Box style={{ marginTop: '15px' }}>
        <Box style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <Event style={{ marginRight: '8px', color: '#3f51b5' }} />
          <Typography variant="body2" color="textSecondary">
             {formattedStartDate} - {formattedEndDate}
          </Typography>
        </Box>
        
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime style={{ marginRight: '8px', color: '#3f51b5' }} />
          <Typography variant="body2" color="textSecondary">
            {formattedStartTime} - {formattedEndTime}
          </Typography>
        </Box>
      </Box>

      {/* Task Description */}
      <Typography style={{ marginTop: '20px', color: '#555', lineHeight: '1.6' }}>
        {task.TaskDescription}
      </Typography>

      {/* Additional Styling for Spacing */}
      <div style={{ marginTop: '30px' }}></div>
    </div>
  );
}
