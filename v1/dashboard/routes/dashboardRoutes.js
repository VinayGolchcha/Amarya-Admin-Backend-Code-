import express, { Router } from 'express';
import { getAllActivities,getUserProfile,feedbackForm,fetchAnnouncements,showImage } from '../controllers/dashboardcontrollers.js';
import { getDataVal } from '../../../utils/validation.js';

const app = express()
const router = Router();

app.get('/admin/employee/count/all', fetchEmployeeCount);

app.use("/", router);

export default app;