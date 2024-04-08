import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday,addLeaveType, addLeaveTypeAndCount, updateLeave, fetchLeavesCount, leaveRequest, fetchListOfLeaves, getAllUsersLeaveCountByAdmin, getUserLeaveData, fetchLeaveTakenOverview, fetchHolidayList, deleteHoliday } from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveTypeVal, addLeaveCountVal, updateLeaveVal, leaveRequestVal, delTrnVal} from '../../../utils/validation.js';

app.post('/admin/add-holiday',addHolidayVal,addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id',updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type',addLeaveTypeVal, addLeaveType);
app.post('/admin/add-leave-count',addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave/:id',updateLeaveVal, updateLeave);
app.get('/fetch-leaves-count', fetchLeavesCount);
app.get('/fetch-leaves-list', fetchListOfLeaves);
app.post('/leave-request',leaveRequestVal, leaveRequest);
app.get('/admin/get-all-leave-count', getAllUsersLeaveCountByAdmin);
app.get('/user-leave-data', getUserLeaveData);
app.get('/get-leave-overview', fetchLeaveTakenOverview);
app.get('/fetch-holiday-list', fetchHolidayList);
app.put('/admin/delete-holiday', delTrnVal ,deleteHoliday);

app.use("/", router);

export default app;