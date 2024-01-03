import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {createAsset} from '../controllers/assetController.js';
// import { register, login, sendOtp } from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/create-asset', createAsset);
// app.post('/login', userLogin);

app.use("/", router);

export default app;