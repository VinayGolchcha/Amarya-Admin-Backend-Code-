import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday, addLeaveTypeAndCount,
    fetchLeaveTypesAndTheirCount, leaveRequest, getUserLeaveDataForDashboard, 
    getUserLeaveData, fetchLeaveTakenOverview, updateLeaveTypeAndCount, deleteLeaveTypeAndCount,fetchHolidayList, deleteHoliday, 
    getUserAllLeaveData} from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveCountVal, leaveRequestVal, updateLeaveTypeAndCountVal, deleteLeaveTypeAndCountVal, getUserLeaveDashboardData, fetchLeaveOverviewVal, getTrnVal} from '../../../utils/validation.js';

app.post('/admin/add-holiday',addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id',updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type-and-count',addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave-type-and-count/:id/:leave_type_id',updateLeaveTypeAndCountVal, updateLeaveTypeAndCount);
app.delete('/admin/delete-leave-type-and-count/:id/:leave_type_id',deleteLeaveTypeAndCountVal, deleteLeaveTypeAndCount);
app.get('/fetch-leave-type-and-count', fetchLeaveTypesAndTheirCount);
app.post('/leave-request',leaveRequestVal, leaveRequest);
app.get('/get-user-leave-dashboard-data/:id',getUserLeaveDashboardData, getUserLeaveDataForDashboard);
app.get('/user-leave-data', getUserLeaveData);
app.get('/user-all-leave-data',getTrnVal, getUserAllLeaveData);
app.get('/fetch-leave-overview',fetchLeaveOverviewVal, fetchLeaveTakenOverview);
app.get('/fetch-holiday-list', fetchHolidayList);
app.delete('/admin/delete-holiday/:id', deleteHoliday);

app.use("/", router);

export default app;