import express, { Router } from "express";
import {addActivity, deleteActivity, filterActivityByDate, getActivityById, getAllActivities, updateActivity} from "../controllers/activityController.js";
import { crAnnVal, upAnnVal, delAnnVal, activityDateVal, getActIdVal } from "../../../utils/validation.js";
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"
const app = express();
const router = Router();


app.post("/admin/add-activity",authenticateAdminSession, crAnnVal, addActivity);
app.get("/filter-activity-by-date",authenticateUserAdminSession,activityDateVal, filterActivityByDate);
app.get("/user/get-activity/:id",authenticateUserSession, getActIdVal, getActivityById);
app.put("/admin/update-activity/:id",authenticateAdminSession, upAnnVal, updateActivity);
app.delete("/admin/delete-activity",authenticateAdminSession,delAnnVal , deleteActivity);
app.get("/fetch-activity",authenticateUserAdminSession, getAllActivities);
app.use("/", router);

export default app;
