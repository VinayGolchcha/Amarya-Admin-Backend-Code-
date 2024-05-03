import express, { Router } from 'express';
// import { createTeamVal, updateTeamVal } from '../../../utils/validation';
import { createTeam, deleteTeam, fetchTeams, updateTeam } from '../controllers/teamController.js';
import { deleteIdVal, createTeamVal, updateTeamVal } from '../../../utils/validation.js';
const app = express()
const router = Router();

app.post('/admin/create-team', createTeamVal, createTeam);
app.put('/admin/update-team/:id', updateTeamVal, updateTeam);
app.get('/fetch-all-teams', fetchTeams);
app.delete('/admin/delete-team/:id', deleteIdVal,deleteTeam);


app.use("/", router);

export default app;