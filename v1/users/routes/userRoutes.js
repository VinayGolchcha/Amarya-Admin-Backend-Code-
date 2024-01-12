import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {userRegistration, userLogin, userLogout, updateUserPassword} from '../controllers/userController.js';
import {login} from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/admin/register', userRegistration);
app.post('/login', login, userLogin);
app.get('/logout/:id', userLogout);
app.post('/update-password', updateUserPassword);

app.use("/", router);

export default app;