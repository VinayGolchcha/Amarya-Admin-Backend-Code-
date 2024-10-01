import express, { Router } from 'express';
import { fetchUserPresentAttendance, getCameraStatus, getUserAttendancePercentage, getUserAttendanceSummary, updateMismatchedUserAttendance, updateUnknownAttendanceToKnown, fetchWeeklyPresentCount, fetchUnidentifiedPeopleList, deleteUnidentifiedPerson, updateUnidentifiedPerson, getAllUserAttendanceSummary, getAllUserAttendanceSummaryExcelBuffer} from '../controllers/attendanceController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
const app = express()
const router = Router();

app.get('/check-camera-status', getCameraStatus);
app.get('/get-attendance-summary', getUserAttendanceSummary);
app.get('/fetch-weekly-present-count',authenticateAdminSession, fetchWeeklyPresentCount);
app.get('/fetch-user-present-attendance', fetchUserPresentAttendance);
app.get('/fetch-unknown-detections', fetchUnidentifiedPeopleList);
app.delete('/delete-unknown-detection/:id', deleteUnidentifiedPerson);
app.put('/update-unknown-detection/:id', updateUnidentifiedPerson);
app.get('/get-user-attendance-percentage', getUserAttendancePercentage);
app.put('/update-unknown-attendance', updateUnknownAttendanceToKnown);
app.put('/update-missmatched-attendance', updateMismatchedUserAttendance);
app.get('/get-all-attendance-summary', getAllUserAttendanceSummary);
app.get('/get-all-attendance-summary-excel', getAllUserAttendanceSummaryExcelBuffer);

app.use("/", router);
export default app;