import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday,addLeaveType, addLeaveTypeAndCount, updateLeave, fetchLeavesCount, leaveRequest, fetchListOfLeaves, getAllUsersLeaveCountByAdmin } from '../controllers/leaveController.js';
import {addHolidayVal, updateHolidayVal, addLeaveTypeVal, addLeaveCountVal, updateLeaveVal, leaveRequestVal} from '../../../utils/validation.js';

app.post('/admin/add-holiday',addHolidayVal, addHoliday);
app.put('/admin/update-holiday/:id',updateHolidayVal, updateHoliday);
app.post('/admin/add-leave-type',addLeaveTypeVal, addLeaveType);
app.post('/admin/add-leave-count',addLeaveCountVal, addLeaveTypeAndCount);
app.put('/admin/update-leave/:id',updateLeaveVal, updateLeave);
app.get('/fetch-leaves-count', fetchLeavesCount);
app.get('/fetch-leaves-list', fetchListOfLeaves);
app.post('/leave-request',leaveRequestVal, leaveRequest);
app.get('/admin/get-all-leave-count', getAllUsersLeaveCountByAdmin);

app.use("/", router);

export default app;