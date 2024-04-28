import express, { Router } from 'express';
const app = express()
const router = Router();
import {feedbackForm} from '../controllers/userFeedbackController.js';

app.post('/user-dashboard-feedback',feedbackForm);

app.use("/", router);
export default app;