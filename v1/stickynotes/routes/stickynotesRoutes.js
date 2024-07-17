import express, { Router } from "express";
import {
  addStickyNotes,
  deleteStickyNotes,
  getStickyNotes,
} from "../controllers/stickynotesControllers.js";
import {adStiNoVal,  delStiNoVal, getStiNoVal } from "../../../utils/validation.js";
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"
const app = express();
const router = Router();

// Store temporary note
app.post("/add-stickynotes", authenticateUserAdminSession, adStiNoVal, addStickyNotes);

// Retrieve temporary notes
app.get("/get-user-notes/:emp_id", authenticateUserAdminSession, getStiNoVal, getStickyNotes);
app.delete(`/delete-stickynotes/:id/:emp_id`, authenticateUserAdminSession, delStiNoVal, deleteStickyNotes);
app.use("/", router);

export default app;
