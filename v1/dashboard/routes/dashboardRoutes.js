import express, { Router } from 'express';
import { fetchEmployeeCount } from '../controllers/dashboardcontrollers.js';
const app = express()
const router = Router();

app.get('/admin/employee/count/all', fetchEmployeeCount);

app.use("/", router);

export default app;