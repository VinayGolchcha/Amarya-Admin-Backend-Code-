import express, { Router } from 'express';
import { getCameraStatus, getUserAttendanceSummary } from '../controllers/attendanceController.js';
const app = express()
const router = Router();

app.get('/checkCameraStatus', getCameraStatus);
app.get('/getAttendanceSummary', getUserAttendanceSummary);

app.use("/", router);
export default app;