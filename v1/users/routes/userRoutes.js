import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout, updateUserPassword, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, getUserProfile, updateUserProfile} from '../controllers/userController.js';
<<<<<<< HEAD
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal,} from '../../../utils/validation.js';
=======
import {userRegVal, userLogVal, logOutVal, upPassVal, sendOtpVal, verifyOtpVal, getUserVal} from '../../../utils/validation.js';
>>>>>>> f00df081aaa55674028b95914cfe42d7aefdd8e8
// router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
<<<<<<< HEAD
app.post('/get-user-profile' , getUserProfile);
=======
app.get('/get-user-profile/:emp_id' , getUserVal, getUserProfile);
>>>>>>> f00df081aaa55674028b95914cfe42d7aefdd8e8
app.put('/update-user-profile/:id' , updateUserProfile);




app.use("/", router);

export default app;