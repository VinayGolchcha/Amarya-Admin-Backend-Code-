import express, { Router } from 'express';
const app = express()
const router = Router();
// import authenticateToken from '../../../middlewares/auth.js';
import {} from '../controllers/assetApprovalcontroller.js';
// router.use(authenticateToken)





app.use("/", router);

export default app;