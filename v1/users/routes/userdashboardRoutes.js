import express, { Router } from 'express';
const app = express()
const router = Router();

import { userDashboard, feedbackForm, fetchFeedbackData} from '../controllers/userDashboardController.js';
import { feedbackVal } from '../../../utils/validation.js';


app.post('/user-dashboard-feedback', feedbackVal,feedbackForm);
app.get('/admin/fetch-user-feedback', fetchFeedbackData);
app.get('/user-dashboard/:emp_id', userDashboard);

app.use("/", router);
export default app;