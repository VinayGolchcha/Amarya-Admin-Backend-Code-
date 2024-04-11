import express, { Router } from 'express';
const app = express()
const router = Router();
import authenticateToken from '../../../middlewares/auth.js';
import {updateUserProfile,getFetchAllEmploye,getUserData,userRegistration, userLogin, userLogout, updateUserPassword, checkUserNameAvailability} from '../controllers/userController.js';
import {upProfileVal,getDataVal,userRegVal, userLogVal, logOutVal, upPassVal, checkUserNameAvailabilityVal} from '../../../utils/validation.js';
import {userRegistration, userLogin, userLogout, updateUserPassword, checkUserNameAvailability, verifyEmailForPasswordUpdate, sendOtpForPasswordUpdate, handleGetUserProfile} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, checkUserNameAvailabilityVal,sendOtpVal, verifyOtpVal} from '../../../utils/validation.js';
router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/check-user-name', checkUserNameAvailabilityVal, checkUserNameAvailability)
app.post('/send-otp-password-verification', sendOtpVal, sendOtpForPasswordUpdate);
app.post('/verify-email-for-password-update', verifyOtpVal, verifyEmailForPasswordUpdate);
app.post('/update-password', upPassVal, updateUserPassword);
app.put('/admin/update-profile/:id',upProfileVal,updateUserProfile);
app.get('/admin/fetch-all-employe',getFetchAllEmploye);
app.get('/admin/user-data',getDataVal,getUserData);
app.get('/get-userprofile' , handleGetUserProfile);


app.use("/", router);

export default app;