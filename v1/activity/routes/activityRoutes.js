import express, { Router } from "express";
import {addActivity, deleteActivity, filterActivityByDate, getActivityById, getAllActivities, updateActivity} from "../controllers/activityController.js";
import { crAnnVal, upAnnVal, delAnnVal, activityDateVal, getActIdVal } from "../../../utils/validation.js";
const app = express();
const router = Router();


app.post("/admin/add-activity", crAnnVal, addActivity);
app.get("/admin/fetch-activity", getAllActivities);
app.get("/admin/filter-date",activityDateVal, filterActivityByDate);
app.get("/user/get-activity/:id", getActIdVal, getActivityById);
app.put("/admin/update-activity/:id", upAnnVal, updateActivity);
app.delete("/admin/delete-activity",delAnnVal , deleteActivity);
app.get("/fetch-activity", getAllActivities);
app.get("/filter-date", filterActivityByDate);
app.use("/", router);

export default app;
