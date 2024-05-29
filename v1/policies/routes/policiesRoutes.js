import express , { Router } from "express";
import multer from 'multer';
import { fetchPolicy, addPolicy, deletePolicy } from "../controllers/policiesControllers.js";
import { addPolicyVal, delPolicyVal } from "../../../utils/validation.js";
const app = express();
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.get("/fetch-policy" , fetchPolicy);
app.post("/admin/add-policy", upload.single('file'), addPolicyVal, addPolicy);
app.delete("/admin/delete-policy/:id", delPolicyVal , deletePolicy);

app.use("/", router);
export default app;
