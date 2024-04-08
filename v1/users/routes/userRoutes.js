import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout, updateUserPassword, checkUserNameAvailability, handleGetUserProfile} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal, checkUserNameAvailabilityVal} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/check-user-name', checkUserNameAvailabilityVal, checkUserNameAvailability)
app.post('/update-password', upPassVal, updateUserPassword);
app.get('/get-userprofile' , handleGetUserProfile);


app.use("/", router);

export default app;