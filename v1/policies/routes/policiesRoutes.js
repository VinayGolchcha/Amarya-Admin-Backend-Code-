import express , { Router } from "express";
import multer from 'multer';
import { fetchPolicy, addPolicy, deletePolicy } from "../controllers/policiesControllers.js";
import { addPolicyVal, delPolicyVal } from "../../../utils/validation.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const downloaded_data_path = path.join(__dirname, '..', '..','..', './downloads');

import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.use('/download', express.static(downloaded_data_path));
app.get("/fetch-policy" ,authenticateUserAdminSession, fetchPolicy);
app.post("/admin/add-policy",authenticateAdminSession, upload.single('file'), addPolicyVal, addPolicy);
app.delete("/admin/delete-policy/:id",authenticateAdminSession, delPolicyVal , deletePolicy);

app.use("/", router);
export default app;
