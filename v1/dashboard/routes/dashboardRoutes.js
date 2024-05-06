import express, { Router } from 'express';
import { fetchEmployeeCount } from '../controllers/dashboardControllers.js';
const app = express()
const router = Router();
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"

app.get('/admin/employee/count/all',authenticateAdminSession, fetchEmployeeCount);


app.use("/", router);

export default app;