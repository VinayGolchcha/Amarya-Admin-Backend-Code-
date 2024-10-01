import express, { Router } from 'express';
import multer from 'multer';
const app = express()
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
import {addTrnVal, reqTrnVal, getTrnVal}from '../../../utils/validation.js'
import {addNewTraining, requestUserTraining, trainingCardsData, getUserTrainingData, deleteTrainingData, updateTrainingData, getEveryUserTrainingData} from '../controllers/trainingController.js';
import {authenticateUserSession} from "../../../middlewares/userAuth.js"
import {authenticateAdminSession} from "../../../middlewares/adminAuth.js"
import {authenticateUserAdminSession} from "../../../middlewares/userAdminAuth.js"


app.post('/admin/add-new-training', authenticateAdminSession, upload.single('file'), addTrnVal, addNewTraining);
app.post('/request-new-training', authenticateUserSession, reqTrnVal, requestUserTraining);
app.get('/training-cards', authenticateUserAdminSession, trainingCardsData);
app.post('/get-user-training', authenticateUserSession, getTrnVal, getUserTrainingData);
app.delete('/admin/delete-training/:id', authenticateAdminSession, deleteTrainingData);
app.put('/admin/update-training/:id', authenticateAdminSession, upload.single('file'), updateTrainingData);
app.get('/admin/display-all-users-training-data', authenticateAdminSession, getEveryUserTrainingData);

app.use("/", router);

export default app;