import express, { Router } from 'express';
const app = express()
const router = Router();
import {allAppVal, fetchUnassignedAssetItemVal} from '../../../utils/validation.js'
import {approvalByAdmin, fetchUnassignedAssetItem} from '../controllers/approvalController.js';
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"


app.put("/admin/approval",authenticateAdminSession, allAppVal, approvalByAdmin)
app.get("/admin/fetch-unassigned-asset-item",authenticateAdminSession,fetchUnassignedAssetItemVal, fetchUnassignedAssetItem)
app.use("/", router);

export default app;