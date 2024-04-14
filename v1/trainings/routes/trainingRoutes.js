import express, { Router } from 'express';
const app = express()
const router = Router();
import {addTrnVal, reqTrnVal, getTrnVal}from '../../../utils/validation.js'
import {addNewTraining, requestUserTraining, trainingCardsData, getUserTrainingData, deleteTrainingData, updateTrainingData, getEveryUserTrainingData} from '../controllers/trainingController.js';



app.post('/admin/add-new-training',addTrnVal, addNewTraining);
app.post('/request-new-training',reqTrnVal, requestUserTraining);
app.get('/training-cards', trainingCardsData);
app.post('/get-user-training',getTrnVal, getUserTrainingData);
app.delete('/admin/delete-training/:id', deleteTrainingData);
app.put('/admin/update-training/:id', updateTrainingData);
app.get('/admin/display-all-users-training-data', getEveryUserTrainingData);

app.use("/", router);

export default app;