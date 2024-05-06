import express, { Router } from 'express';
const app = express()
const router = Router();
import {crAssVal, assReqVal, fetUserAssVal} from '../../../utils/validation.js'
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets, updateAsset} from '../controllers/assetController.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"



app.post('/admin/create-asset',authenticateAdminSession,crAssVal, createAsset);
app.post('/asset-request',authenticateUserSession,assReqVal, assetRequest);
app.post('/user-asset',authenticateUserSession,fetUserAssVal, fetchUserAssets);
app.get('/admin/fetch-assets',authenticateAdminSession, fetchAssets);
app.delete('/admin/delete-asset/:id',authenticateAdminSession, deleteAsset);
app.put('/admin/update-asset/:id',authenticateAdminSession, updateAsset);

app.use("/", router);

export default app;