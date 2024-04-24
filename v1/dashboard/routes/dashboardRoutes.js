import express, { Router } from 'express';
import { getAllActivities,getUserProfile,feedbackForm,fetchAnnouncements,showImage } from '../controllers/dashboardcontrollers.js';
import { getDataVal } from '../../../utils/validation.js';

const app = express()
const router = Router();

app.post('/dashboard-feedback',feedbackForm);
app.get('/dashboard-fetch-announcement',fetchAnnouncements);
app.get("/dashboard-fetch-activity", getAllActivities);
app.get('/dashboard-user-profile',getDataVal,getUserProfile);
app.get('/dashboard-image',showImage);
//app.post('dashboard-upload',uploadPicture);
//app.get('/dashbaord-project-detail',allProjectDetails)

app.use("/", router);
export default app;