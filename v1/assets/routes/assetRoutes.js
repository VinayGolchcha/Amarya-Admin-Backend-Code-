import express, { Router } from 'express';
const app = express()
const router = Router();
import {crAssVal, assReqVal, fetUserAssVal} from '../../../utils/validation.js'
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets, updateAsset} from '../controllers/assetController.js';




app.post('/admin/create-asset',crAssVal, createAsset);
app.post('/asset-request',assReqVal, assetRequest);
app.post('/user-asset',fetUserAssVal, fetchUserAssets);
app.get('/admin/fetch-assets', fetchAssets);
app.delete('/admin/delete-asset/:id', deleteAsset);
app.put('/admin/update-asset/:id', updateAsset);

app.use("/", router);

export default app;