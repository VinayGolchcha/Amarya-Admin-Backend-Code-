import express, { Router } from 'express';
const app = express()
const router = Router();
import {allAppVal} from '../../../utils/validation.js'
import {approvalByAdmin} from '../controllers/approvalController.js';



app.put("/admin/approval",allAppVal, approvalByAdmin)
app.use("/", router);

export default app;