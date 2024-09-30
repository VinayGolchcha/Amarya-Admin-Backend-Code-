import express, { Router } from 'express';
import { fetchUserPresentAttendance, getCameraStatus, getUserAttendanceSummary, fetchWeeklyPresentCount, fetchUnidentifiedPeopleList, deleteUnidentifiedPerson, updateUnidentifiedPerson} from '../controllers/attendanceController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
const app = express()
const router = Router();

app.get('/check-camera-status', getCameraStatus);
app.get('/get-attendance-summary',authenticateAdminSession, getUserAttendanceSummary);
app.get('/fetch-weekly-present-count',authenticateAdminSession, fetchWeeklyPresentCount);
app.get('/fetch-user-present-attendance', fetchUserPresentAttendance);
app.get('/fetch-unknown-detections', fetchUnidentifiedPeopleList);
app.delete('/delete-unknown-detection/:id', deleteUnidentifiedPerson);
app.put('/update-unknown-detection/:id', updateUnidentifiedPerson);

app.use("/", router);
export default app;