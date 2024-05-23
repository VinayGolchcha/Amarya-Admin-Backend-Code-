import express, { Router } from "express";
import {addActivity, deleteActivity, filterActivityByDate, getActivityById, getAllActivities, updateActivity} from "../controllers/activityController.js";
import { crAnnVal, upAnnVal, delAnnVal, activityDateVal, getActIdVal } from "../../../utils/validation.js";
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const router = Router();


app.post("/admin/add-activity", upload.array('files', 10), crAnnVal, addActivity);
app.get("/filter-activity-by-date/:date",activityDateVal, filterActivityByDate);
app.get("/get-activity/:id", getActIdVal, getActivityById);
app.put("/admin/update-activity/:id", upload.array('files', 10), upAnnVal, updateActivity);
app.delete("/admin/delete-activity/:id", delAnnVal , deleteActivity);
app.get("/fetch-activity", getAllActivities);

app.use("/", router);

export default app;
