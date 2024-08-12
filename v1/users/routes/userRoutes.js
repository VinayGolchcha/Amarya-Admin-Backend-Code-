import express, { Router } from 'express';
import multer from 'multer';
const app = express()
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {userRegistration, userLogin, userLogout, updateUserPassword, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, getUserProfile, updateUserProfile, fetchAllEmployeeIds, userGhostLogin} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal, getUserVal, loginVal} from '../../../utils/validation.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/register', upload.single('file'), userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', authenticateUserAdminSession, logOutVal, userLogout);
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
app.post('/get-user-profile/:emp_id', authenticateUserAdminSession, getUserVal, getUserProfile);
app.put('/update-user-profile/:id' , authenticateUserAdminSession, upload.single('file'), updateUserProfile);
app.get('/fetch-all-employee-ids', fetchAllEmployeeIds);
app.post('/ghost-login', loginVal, userGhostLogin);


app.use("/", router);

export default app;