import express, { Router } from 'express';
const app = express()
const router = Router();

import {fetchAnnouncements,getAllActivities,userProfileDashboard,getDashImage,getUserProject} from '../controllers/userDashboardController.js';

app.get('/dashboard-fetch-announcement',fetchAnnouncements);
app.get('/dashboard-fetch-activity', getAllActivities);
app.get('/dashboard-user-profile',userProfileDashboard);
app.get('/dashboard-image',getDashImage);
app.get('/dashboard-project',getUserProject);

app.use("/", router);
export default app;