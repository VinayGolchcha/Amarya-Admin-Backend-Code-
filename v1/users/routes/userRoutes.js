import express, { Router } from 'express';
import multer from 'multer';
const app = express()
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {userRegistration, userLogin, userLogout, updateUserPassword, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, getUserProfile, updateUserProfile} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal, getUserVal} from '../../../utils/validation.js';


app.post('/admin/register', upload.single('file'), userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
app.get('/get-user-profile/:emp_id' , getUserVal, getUserProfile);
app.put('/update-user-profile/:id' , upload.single('file'), updateUserProfile);


app.use("/", router);

export default app;