import express, { Router } from 'express';
// import { createTeamVal, updateTeamVal } from '../../../utils/validation';
import { createTeam, deleteTeam, fetchTeams, updateTeam } from '../controllers/teamController.js';
import { deleteIdVal, createTeamVal, updateTeamVal } from '../../../utils/validation.js';
const app = express()
const router = Router();

app.post('/create-team', createTeamVal, createTeam);
app.put('/update-team/:id', updateTeamVal, updateTeam);
app.get('/fetch-all-teams', fetchTeams);
app.delete('/delete-team', deleteIdVal,deleteTeam);


app.use("/", router);

export default app;