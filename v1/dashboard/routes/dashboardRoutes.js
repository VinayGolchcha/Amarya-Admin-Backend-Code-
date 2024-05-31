import express, { Router } from 'express';
import { adminDashboard, fetchApprovalData, fetchActivityAndAnnouncementData } from '../controllers/dashboardController.js';
const app = express()
const router = Router();

app.get('/admin/admin-dashboard', adminDashboard);
app.get('/admin/fetch-approval-data', fetchApprovalData);
app.get('/admin/fetch-activity-announcement', fetchActivityAndAnnouncementData);


app.use("/", router);

export default app;