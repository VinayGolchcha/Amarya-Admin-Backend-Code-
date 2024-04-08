import express, { Router } from "express";
import {
  handleAddActivity,
  handleDeleteActivity,
  handleFilterByDate,
  handleGetAllActivities,
  handleUpdateActivity,
} from "../controllers/activityController.js";
import { crAnnVal, upAnnVal, delAnnVal } from "../../../utils/validation.js";
const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-activity", crAnnVal, handleAddActivity);

// Retrieve temporary notes
// app.get("/notes", handleUpdateActivity);
app.put("/admin/update-aactivity/:id", upAnnVal, handleUpdateActivity);
app.delete("/admin/delete-activity",delAnnVal , handleDeleteActivity);
app.get("/admin/fetch-activity", handleGetAllActivities);
app.get("/admin/filter-date", handleFilterByDate);
app.use("/", router);

export default app;
