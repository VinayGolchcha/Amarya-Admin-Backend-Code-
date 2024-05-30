import express, { Router } from 'express';
import { adminDashboard } from '../controllers/dashboardController.js';
const app = express()
const router = Router();

app.get('/admin/admin-dashboard', adminDashboard);


app.use("/", router);

export default app;