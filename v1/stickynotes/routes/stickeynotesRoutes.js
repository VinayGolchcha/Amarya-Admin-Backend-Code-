import express, { Router } from "express";
import {
  handleAddStickeyNotes,
  handleDeleteStickyNotes,
  handleGetStickyNotes,
} from "../../stickynotes/controllers/stickynotesControllers.js";
const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-stickynotes", handleAddStickeyNotes);

// Retrieve temporary notes
app.get("/notes", handleGetStickyNotes);
app.delete("/delete-stickynotes", handleDeleteStickyNotes);
app.use("/", router);

export default app;
