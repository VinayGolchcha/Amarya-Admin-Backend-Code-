import express, { Router } from "express";
import {addActivity, deleteActivity, filterActivityByDate, getAllActivities, updateActivity} from "../controllers/activityController.js";
import { crAnnVal, upAnnVal, delAnnVal, activityDate } from "../../../utils/validation.js";
const app = express();
const router = Router();


app.post("/admin/add-activity", crAnnVal, addActivity);
app.get("/admin/fetch-activity", getAllActivities);
app.get("/admin/filter-date",activityDate, filterActivityByDate);
app.put("/admin/update-activity/:id", upAnnVal, updateActivity);
app.delete("/admin/delete-activity",delAnnVal , deleteActivity);
app.use("/", router);

export default app;
