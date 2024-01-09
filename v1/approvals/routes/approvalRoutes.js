import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {assetApprovalByAdmin, deleteAssetByAdmin} from '../controllers/approvalController.js';
// router.use(authenticateToken)



app.put("/asset-approval/:id", assetApprovalByAdmin)
app.delete("/delete-user-asset", deleteAssetByAdmin)
app.use("/", router);

export default app;