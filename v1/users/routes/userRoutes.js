import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout, updateUserPassword} from '../controllers/userController.js';
import {userRegVal, userLogVal, logOutVal, upPassVal} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/admin/register', userRegVal, userRegistration);
app.post('/login', userLogVal,  userLogin);
app.get('/logout/:id', logOutVal, userLogout);
app.post('/update-password', upPassVal, updateUserPassword);

app.use("/", router);

export default app;