import express, { Router } from 'express';
import { createSkillSet, deleteSkillSet, fetchSkillSets, updateSkillSet } from '../controllers/skillsetController.js';
import { deleteIdVal,createSkillVal, updateSkillVal } from '../../../utils/validation.js';
const app = express()
const router = Router();

app.post('/admin/create-skill', createSkillVal, createSkillSet);
app.put("/admin/update-skill/:id", updateSkillVal,updateSkillSet);
app.get('/admin/fetch-skills', fetchSkillSets);
app.delete('/admin/delete-skill/:id', deleteIdVal, deleteSkillSet);

app.use("/", router);

export default app;