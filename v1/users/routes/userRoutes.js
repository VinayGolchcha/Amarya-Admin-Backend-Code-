import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout, updateUserPassword, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, getUserProfile, updateUserProfile} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal,} from '../../../utils/validation.js';
import {feedbackForm} from '../controllers/userFeedbackController.js';
import {fetchAnnouncements,getAllActivities,userProfileDashboard} from '../controllers/userDashboardController.js'
// router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
app.post('/get-user-profile' , getUserProfile);
app.put('/update-user-profile/:id' , updateUserProfile);
app.post('/user-dashboard-feedback',feedbackForm);
app.get('/dashboard-fetch-announcement',fetchAnnouncements);
app.get("/dashboard-fetch-activity", getAllActivities);
app.get('/dashboard-user-profile',userProfileDashboard);
app.get('/dashboard-image',showImage);
//app.post('dashboard-upload',uploadPicture);
//app.get('/dashbaord-project-detail',allProjectDetails)




app.use("/", router);

export default app;