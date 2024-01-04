import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {createAsset, assetRequest, fetchUserAssets} from '../controllers/assetController.js';
// import { register, login, sendOtp } from '../../../utils/validation.js';
// router.use(authenticateToken)



app.post('/create-asset', createAsset);
app.post('/asset-request', assetRequest);
app.post('/user-asset', fetchUserAssets);
// app.post('/login', userLogin);

app.use("/", router);

export default app;