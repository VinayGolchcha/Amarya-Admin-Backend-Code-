import express, { Router } from 'express';
import { fetchEmployeeCount } from '../controllers/dashboardControllers.js';
const app = express()
const router = Router();

app.get('/admin/employee/count/all', fetchEmployeeCount);


app.use("/", router);

export default app;