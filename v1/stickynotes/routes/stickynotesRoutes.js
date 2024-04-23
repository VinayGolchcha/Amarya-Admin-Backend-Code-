import express, { Router } from "express";
import {
  addStickyNotes,
  deleteStickyNotes,
  getStickyNotes,
} from "../controllers/stickynotesControllers.js";
import {adStiNoVal,  delStiNoVal } from "../../../utils/validation.js";

const app = express();
const router = Router();

// app.js (continued)

// Store temporary note
app.post("/add-stickynotes",adStiNoVal, addStickyNotes);

// Retrieve temporary notes
app.get("/notes", getStickyNotes);
app.delete("/delete-stickynotes",  delStiNoVal, deleteStickyNotes);
app.use("/", router);

export default app;
