import express, { Router } from 'express';
import { fetchEmployeeCount, fetchTeamPerformance } from '../controllers/dashboardControllers.js';
const app = express()
const router = Router();

app.get('/admin/employee/count/all', fetchEmployeeCount);
app.get('/admin/get-team-performance' , fetchTeamPerformance);

app.use("/", router);

export default app;