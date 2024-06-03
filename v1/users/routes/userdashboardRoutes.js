import express, { Router } from 'express';
const app = express()
const router = Router();

import { userDashboard, feedbackForm, fetchFeedbackData, getDashboardImages, fetchUserPointsMonthlyAndYearly} from '../controllers/userDashboardController.js';
import { feedbackVal } from '../../../utils/validation.js';


app.post('/user-dashboard-feedback', feedbackVal,feedbackForm);
app.get('/admin/fetch-user-feedback', fetchFeedbackData);
app.get('/user-dashboard/:emp_id', userDashboard);
app.get('/get-dashboard-images', getDashboardImages);
app.get('/get-user-points-data-for-graph/:emp_id', fetchUserPointsMonthlyAndYearly);

app.use("/", router);
export default app;