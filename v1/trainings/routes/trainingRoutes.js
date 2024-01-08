import express, { Router } from 'express';
const app = express()
const router = Router();
import {addNewTraining, requestUserTraining, trainingCardsData, userTrainingData} from '../controllers/trainingController.js';



app.post('/add-new-training', addNewTraining);
app.post('/request-new-training', requestUserTraining);trainingCardsData
app.get('/training-cards', trainingCardsData);
app.post('/user-training', userTrainingData);

app.use("/", router);

export default app;