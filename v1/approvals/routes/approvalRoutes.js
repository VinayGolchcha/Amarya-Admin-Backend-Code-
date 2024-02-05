import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {assAppVal} from '../../../utils/validation.js'
import {assetApprovalByAdmin} from '../controllers/approvalController.js';
// router.use(authenticateToken)



app.put("/admin/asset-approval/:id",assAppVal, assetApprovalByAdmin)
app.use("/", router);

export default app;