import express, { Router } from 'express';
import { getCameraStatus, getUserAttendancePercentage, getUserAttendanceSummary, updateMismatchedUserAttendance, updateUnknownAttendanceToKnown } from '../controllers/attendanceController.js';
const app = express()
const router = Router();

app.get('/check-camera-status', getCameraStatus);
app.get('/get-attendance-summary', getUserAttendanceSummary);
app.get('/get-user-attendance-percentage', getUserAttendancePercentage);
app.put('/update-unknown-attendance', updateUnknownAttendanceToKnown);
app.put('/update-missedmatched-attendance', updateMismatchedUserAttendance);




app.use("/", router);
export default app;