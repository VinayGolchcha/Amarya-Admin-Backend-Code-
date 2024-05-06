import express, { Router } from 'express';
import { createProjectVal, deleteIdVal, updateProjectVal } from '../../../utils/validation.js';
import { createProject, deleteProject, fetchProjects, updateProject } from '../controllers/projectController.js';
const app = express()
const router = Router();
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"

app.post('/admin/create-project', authenticateAdminSession,  createProjectVal, createProject);
app.put('/admin/update-project/:id/:category_id', authenticateAdminSession, updateProjectVal, updateProject);
app.get('/fetch-all-projects', authenticateUserAdminSession, fetchProjects);
app.delete('/admin/delete-project/:id/:category_id', authenticateAdminSession, deleteIdVal, deleteProject);


app.use("/", router);

export default app;