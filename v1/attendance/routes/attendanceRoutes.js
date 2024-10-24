import express, { Router } from 'express';
import { fetchUserPresentAttendance, getCameraStatus, getUserAttendancePercentage, getUserAttendanceSummary, updateMismatchedUserAttendance, updateUnknownAttendanceToKnown, fetchWeeklyPresentCount, fetchUnidentifiedPeopleList, deleteUnidentifiedPerson, updateUnidentifiedPerson, getAllUserAttendanceSummary, getAllUserAttendanceSummaryExcelBuffer, getDailyUserAttendance, getUserAttendanceByDate, generateAttendanceExcel} from '../controllers/attendanceController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {unidentifiedPersonVal} from "../../../utils/validation.js"
const app = express()
const router = Router();

app.get('/check-camera-status',authenticateAdminSession, getCameraStatus);
app.get('/get-attendance-summary',authenticateAdminSession, getUserAttendanceSummary);
app.get('/fetch-weekly-present-count',authenticateAdminSession, fetchWeeklyPresentCount);
app.get('/fetch-user-present-attendance',authenticateAdminSession, fetchUserPresentAttendance);
app.get('/fetch-unknown-detections',authenticateAdminSession, fetchUnidentifiedPeopleList);
app.delete('/delete-unknown-detection/:id',authenticateAdminSession,unidentifiedPersonVal, deleteUnidentifiedPerson);
app.put('/update-unknown-detection/:id',authenticateAdminSession,unidentifiedPersonVal, updateUnidentifiedPerson);
app.get('/get-user-attendance-percentage',authenticateAdminSession, getUserAttendancePercentage);
app.put('/update-unknown-attendance',authenticateAdminSession, updateUnknownAttendanceToKnown);
app.put('/update-missmatched-attendance',authenticateAdminSession, updateMismatchedUserAttendance);
app.get('/get-all-attendance-summary',authenticateAdminSession, getAllUserAttendanceSummary);
app.get('/get-all-attendance-summary-excel',authenticateAdminSession, getAllUserAttendanceSummaryExcelBuffer);
app.get('/get-user-daily-attendance',authenticateAdminSession, getDailyUserAttendance);
app.get('/get-user-attendance-date',authenticateAdminSession, getUserAttendanceByDate);
app.get('/get-user-daily-attendance-excel', authenticateAdminSession, generateAttendanceExcel);



app.use("/", router);
export default app;