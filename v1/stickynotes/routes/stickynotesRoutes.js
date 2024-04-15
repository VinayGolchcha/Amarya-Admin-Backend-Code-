import express, { Router } from "express";
import {
  addStickeyNotes,
  deleteStickyNotes,
  getStickyNotes,
} from "../controllers/stickynotesControllers.js";
import { adStiNo, delStiNo } from "../../../utils/validation.js";
const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-stickynotes",adStiNo, addStickeyNotes);

// Retrieve temporary notes
app.get("/notes", getStickyNotes);
app.delete("/delete-stickynotes",  delStiNo, deleteStickyNotes);
app.use("/", router);

export default app;
