import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout} from '../controllers/userController.js';
import {login} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/register', userRegistration);
app.post('/login', login, userLogin);
app.post('/logout/:id', userLogout);

app.use("/", router);

export default app;