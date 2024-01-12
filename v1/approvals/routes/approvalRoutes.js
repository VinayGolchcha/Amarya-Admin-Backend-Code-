import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {assetApprovalByAdmin} from '../controllers/approvalController.js';
// router.use(authenticateToken)



app.put("/admin/asset-approval/:id", assetApprovalByAdmin)
app.use("/", router);

export default app;