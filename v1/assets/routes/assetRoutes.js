import express, { Router } from 'express';
const app = express()
const router = Router();
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets} from '../controllers/assetController.js';




app.post('/create-asset', createAsset);
app.post('/asset-request', assetRequest);
app.post('/user-asset', fetchUserAssets);
app.get('/admin/assets', fetchAssets);
app.post('/admin/delete-asset', deleteAsset);

app.use("/", router);

export default app;