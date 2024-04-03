import express, { Router } from 'express';
const app = express()
const router = Router();
import {addTrnVal, reqTrnVal, getTrnVal, delTrnVal}from '../../../utils/validation.js'
import {addNewTraining, requestUserTraining, trainingCardsData, getUserTrainingData, deleteTrainingData, updateTrainings} from '../controllers/trainingController.js';



app.post('/admin/add-new-training',addTrnVal, addNewTraining);
app.post('/request-new-training',reqTrnVal, requestUserTraining);
app.get('/training-cards', trainingCardsData);
app.post('/user-training',getTrnVal, getUserTrainingData);
// app.delete('/delete-user-training', deleteUserTrainingData);  // to be deleted
app.delete('/admin/delete-training',delTrnVal, deleteTrainingData);
app.put('/admin/update-training/:id', updateTrainings);

app.use("/", router);

export default app;