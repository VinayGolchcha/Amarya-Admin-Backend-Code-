import express, { Router } from "express";
import {
  addStickyNotes,
  deleteStickyNotes,
  getStickyNotes,
} from "../controllers/stickynotesControllers.js";
import {adStiNoVal,  delStiNoVal, getStiNoVal } from "../../../utils/validation.js";

const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-stickynotes",adStiNoVal, addStickyNotes);

// Retrieve temporary notes
app.get("/get-user-notes/:emp_id",getStiNoVal, getStickyNotes);
app.delete(`/delete-stickynotes/:id/:emp_id`,  delStiNoVal, deleteStickyNotes);
app.use("/", router);

export default app;
