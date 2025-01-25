import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer  from './slices/jobSlice'
import formReducer from './slices/CreateformSlice'
import jobNoticeReducer from './slices/jobNoticeSlice'
import noticeReducer from './slices/noticeSlice';
import attendanceReducer from './slices/AttendenceSlice';
import addAttendenceReducer from './slices/AddAttendenceSlice';
import leaveReducer from './slices/LeaveSlice';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice'; 
import skillReducer from './slices/skillSlice';
import countryReducer from "../redux/slices/Countrystate/countrySlice";
import stateReducer from './slices/Countrystate/stateSlice';
import jobRoleReducer from "./slices/Jobrole_interview/jobRoleSlice";
 import interviewRoundsReducer from "./slices/Jobrole_interview/interviewSlice";


 import jobApplicationReducer from './slices/JobApplicationsSlice/JobApplicationsSlice';
 import interviewReducer from './slices/InterviewSlice/InterviewSlice';
 import interviewerReducer from './slices/InterviewerSlice/InterviewerSlice';
 
 import selectcandidateReducer from './slices/selectedCandidateSlice';
 import offerLetterReducer from './slices/offerletterSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    form: formReducer,
    jobNotices: jobNoticeReducer,
    notices: noticeReducer,
    attendance: attendanceReducer,
    addAttendence: addAttendenceReducer,
    leave: leaveReducer,

    jobApplication: jobApplicationReducer,
    interview: interviewReducer,
    interviews: interviewerReducer,

    tasks: taskReducer,
    user: userReducer,
    skills: skillReducer,
    countries: countryReducer,
    states: stateReducer,
    jobRoles:jobRoleReducer,
    interviewRounds:interviewRoundsReducer,


    candidates: selectcandidateReducer,
    offerLetter: offerLetterReducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
