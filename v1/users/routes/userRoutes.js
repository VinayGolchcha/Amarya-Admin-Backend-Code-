import express, { Router } from 'express';
const app = express()
const router = Router();
//import authenticateToken from '../../../middlewares/auth.js';
import {updateUserProfile,getFetchAllEmploye,getUserProfile,userRegistration, userLogin, userLogout, updateUserPassword, checkUserNameAvailability} from '../controllers/userController.js';
import {upProfileVal,getDataVal,userRegVal, userLogVal, logOutVal, upPassVal, checkUserNameAvailabilityVal} from '../../../utils/validation.js';
import {verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, handleGetUserProfile} from '../controllers/userController.js';
import { sendOtpVal, verifyOtpVal} from '../../../utils/validation.js';
//router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
app.post('/get-user-profile' , getUserProfile);updateUserProfile
app.put('/update-user-profile/:id' , updateUserProfile);
app.put('/update-user-profile/:id',upProfileVal,updateUserProfile);
app.get('/admin/fetch-all-employe',getFetchAllEmploye);
app.get('/get-user-profile',getDataVal,getUserProfile);
app.get('/get-userprofile' , handleGetUserProfile);


app.use("/", router);

export default app;