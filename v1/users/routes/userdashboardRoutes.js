import express, { Router } from 'express';
const app = express()
const router = Router();

import {fetchAnnouncements,getAllActivities,getuserProfileDashboard,getUserProject} from '../controllers/userDashboardController.js';

app.get('/dashboard-fetch-announcement',fetchAnnouncements);
app.get('/dashboard-fetch-activity', getAllActivities);
app.get('/dashboard-user-profile/:emp_id',getuserProfileDashboard);
//app.post('/dashboard-image',uploadDashImage);
app.get('/dashboard-project/:emp_id',getUserProject);

app.use("/", router);
export default app;