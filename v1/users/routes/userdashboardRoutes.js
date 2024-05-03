import express, { Router } from 'express';
const app = express()
const router = Router();

import {fetchAnnouncements,getAllActivities,userProfileDashboard,getDashImage} from '../controllers/userDashboardController.js';

app.get('/dashboard-fetch-announcement',fetchAnnouncements);
app.get('/dashboard-fetch-activity', getAllActivities);
app.get('/dashboard-user-profile',userProfileDashboard);
app.get('/dashboard-image',getDashImage)

app.use("/", router);
export default app;