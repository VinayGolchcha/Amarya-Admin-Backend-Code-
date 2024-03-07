import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday, updateHoliday,addLeaveType, addLeaveTypeAndCount, updateLeave, fetchLeavesCount, leaveRequest, fetchListOfLeaves, getAllUsersLeaveCountByAdmin } from '../controllers/leaveController.js';
import {} from '../../../utils/validation.js';

app.post('/admin/add-holiday', addHoliday);
app.put('/admin/update-holiday/:id', updateHoliday);
app.post('/admin/add-leave-type', addLeaveType);
app.post('/admin/add-leave-count', addLeaveTypeAndCount);
app.put('/admin/update-leave/:id', updateLeave);
app.get('/fetch-leaves-count', fetchLeavesCount);
app.get('/fetch-leaves-list', fetchListOfLeaves);
app.post('/leave-request', leaveRequest);
app.get('/admin/get-all-leave-count', getAllUsersLeaveCountByAdmin);

app.use("/", router);

export default app;