import express, { Router } from 'express';
const app = express()
const router = Router();
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets, updateAsset} from '../controllers/assetController.js';




app.post('/admin/create-asset', createAsset);
app.post('/asset-request', assetRequest);
app.post('/user-asset', fetchUserAssets);
app.get('/admin/fetch-assets', fetchAssets);
app.delete('/admin/delete-asset', deleteAsset);
app.put('/admin/update-asset/:id', updateAsset);

app.use("/", router);

export default app;