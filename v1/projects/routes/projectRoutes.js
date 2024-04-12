import express, { Router } from 'express';
import { createProjectVal, deleteIdVal, updateProjectVal } from '../../../utils/validation.js';
import { createProject, deleteProject, fetchProjects, updateProject } from '../controllers/projectController.js';
const app = express()
const router = Router();

app.post('/create-project',createProjectVal, createProject);
app.put("/update-project/:id/:category_id",updateProjectVal, updateProject);
app.get('/fetch-all-projects', fetchProjects);
app.delete('/delete-project/:id/:category_id',deleteIdVal, deleteProject);


app.use("/", router);

export default app;