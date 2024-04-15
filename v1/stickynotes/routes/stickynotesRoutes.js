import express, { Router } from "express";
import {
  handleAddStickeyNotes,
  handleDeleteStickyNotes,
  handleGetStickyNotes,
} from "../controllers/stickynotesControllers.js";
import { adStiNo, delStiNo } from "../../../utils/validation.js";
const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-stickynotes",adStiNo, handleAddStickeyNotes);

// Retrieve temporary notes
app.get("/notes", handleGetStickyNotes);
app.delete("/delete-stickynotes",  delStiNo, handleDeleteStickyNotes);
app.use("/", router);

export default app;
