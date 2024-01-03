import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration} from '../controllers/userController.js';
// import { register, login, sendOtp } from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/register', userRegistration);
// app.post('/login', userLogin);

app.use("/", router);

export default app;