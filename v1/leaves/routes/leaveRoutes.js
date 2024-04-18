import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday,addLeaveType, addLeaveTypeAndCount,  fetchListOfLeaves,updateLeaveType,deleteLeaveType} from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveTypeVal, addLeaveCountVal, updateLeaveVal, leaveRequestVal, updateLeaveTypeAndCountVal, deleteLeaveTypeAndCountVal, getAllLeaveCountVal} from '../../../utils/validation.js';
import { fetchLeaveTypesAndTheirCount, leaveRequest, getAllUsersLeaveCountByAdmin, 
    getUserLeaveData, fetchLeaveTakenOverview, updateLeaveTypeAndCount, deleteLeaveTypeAndCount,fetchHolidayList, deleteHoliday } from '../controllers/leaveController.js';



app.post('/admin/add-holiday',addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id',updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type-and-count',addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave-type-and-count/:id/:leave_type_id',updateLeaveTypeAndCountVal, updateLeaveTypeAndCount);
app.delete('/admin/delete-leave-type-and-count/:id/:leave_type_id',deleteLeaveTypeAndCountVal, deleteLeaveTypeAndCount);
app.get('/fetch-leave-type-and-count', fetchLeaveTypesAndTheirCount);
app.post('/leave-request',leaveRequestVal, leaveRequest);
app.get('/get-all-leave-count/:id',getAllLeaveCountVal, getAllUsersLeaveCountByAdmin);
app.get('/user-leave-data', getUserLeaveData);
app.get('/fetch-leave-overview',fetchLeaveOverviewVal, fetchLeaveTakenOverview);
app.get('/fetch-holiday-list', fetchHolidayList);
app.delete('/admin/delete-holiday/:id', deleteHoliday);

app.use("/", router);

export default app;