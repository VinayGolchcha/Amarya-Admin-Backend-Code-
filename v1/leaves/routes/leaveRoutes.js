import express, { Router } from 'express';
const app = express()
const router = Router();
import { addHoliday } from '../controllers/leaveController.js';
import {} from '../../../utils/validation.js';

app.post('/admin/add-holiday', addHoliday);

app.use("/", router);

export default app;