import express, { Router } from 'express';
import { createSkillSet, deleteSkillSet, fetchSkillSets, updateSkillSet } from '../controllers/skillsetController.js';
import { deleteIdVal,createSkillVal, updateSkillVal } from '../../../utils/validation.js';
const app = express()
const router = Router();

app.post('/create-skill', createSkillVal, createSkillSet);
app.put("/update-skill/:id", updateSkillVal,updateSkillSet);
app.get('/fetch-skills', fetchSkillSets);
app.delete('/delete-skill/:id', deleteIdVal, deleteSkillSet);

app.use("/", router);

export default app;