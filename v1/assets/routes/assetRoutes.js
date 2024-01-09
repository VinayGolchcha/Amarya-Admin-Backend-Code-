import express, { Router } from 'express';
const app = express()
const router = Router();
import {createAsset, assetRequest, fetchUserAssets, deleteAsset} from '../controllers/assetController.js';




app.post('/create-asset', createAsset);
app.post('/asset-request', assetRequest);
app.post('/user-asset', fetchUserAssets);
app.post('/delete-asset', deleteAsset);

app.use("/", router);

export default app;