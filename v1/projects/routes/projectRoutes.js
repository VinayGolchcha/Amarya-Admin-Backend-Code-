import express, { Router } from 'express';
import { createProjectVal, deleteIdVal, updateProjectVal } from '../../../utils/validation.js';
import { createProject, deleteProject, fetchProjects, updateProject } from '../controllers/projectController.js';
import {createUserProject,fetchUserProjects} from '../controllers/userProjectController.js';
const app = express()
const router = Router();

app.post('/admin/create-project', createProjectVal, createProject);
app.put('/admin/update-project/:id/:category_id',updateProjectVal, updateProject);
app.get('/admin/fetch-all-projects', fetchProjects);
app.delete('/admin/delete-project/:id/:category_id',deleteIdVal, deleteProject);
app.post('/user-profile-project',createUserProject)
app.get('/fetch-user-projects/:project_id', fetchUserProjects);


app.use("/", router);

export default app;