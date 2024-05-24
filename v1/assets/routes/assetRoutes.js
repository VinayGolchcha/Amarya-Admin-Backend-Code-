import express, { Router } from 'express';
import multer from 'multer';
const app = express()
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {crAssVal, assReqVal, fetUserAssVal} from '../../../utils/validation.js'
import {createAsset, assetRequest, fetchUserAssets, deleteAsset, fetchAssets, updateAsset} from '../controllers/assetController.js';


app.post('/admin/create-asset', upload.single('file'), crAssVal, createAsset);
app.post('/asset-request', assReqVal, assetRequest);
app.post('/user-asset', fetUserAssVal, fetchUserAssets);
app.get('/admin/fetch-assets', fetchAssets);
app.delete('/admin/delete-asset/:id', deleteAsset);
app.put('/admin/update-asset/:id', upload.single('file'), updateAsset);

app.use("/", router);

export default app;