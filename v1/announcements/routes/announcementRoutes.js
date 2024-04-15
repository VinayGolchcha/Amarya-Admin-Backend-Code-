import express, { Router } from 'express';
const app = express()
const router = Router();
import {crAnnVal, upAnnVal, delAnnVal} from "../../../utils/validation.js"
import {createAnnouncement, fetchAnnouncements, deleteAnnouncements, updateAnnouncements} from '../controllers/announcementController.js';



app.post('/admin/add-announcement',crAnnVal, createAnnouncement);
app.get('/admin/fetch-announcement', fetchAnnouncements);
app.delete('/admin/delete-announcement/:id', deleteAnnouncements);
app.put('/admin/update-announcement/:id',upAnnVal, updateAnnouncements);

app.use("/", router);

export default app;