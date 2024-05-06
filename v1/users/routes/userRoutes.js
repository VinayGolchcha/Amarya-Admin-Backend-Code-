import express, { Router } from 'express';
const app = express()
const router = Router();
import {userRegistration, userLogin, userLogout, updateUserPassword, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, getUserProfile, updateUserProfile} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal} from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/register', authenticateAdminSession, userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', authenticateUserAdminSession, logOutVal, userLogout);
app.post('/send-otp-password-verification', authenticateUserAdminSession, sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', authenticateUserAdminSession, verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', authenticateUserAdminSession, upPassVal, updateUserPassword);
app.post('/get-user-profile', authenticateUserSession, getUserProfile);
app.put('/update-user-profile/:id' , authenticateUserSession, updateUserProfile);


app.use("/", router);

export default app;