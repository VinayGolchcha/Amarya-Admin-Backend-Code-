import express, { Router } from 'express';
const app = express()
const router = Router();
import {createAnnouncement, fetchAnnouncements, deleteAnnouncements, updateAnnouncements} from '../controllers/announcementController.js';



app.post('/add-announcement', createAnnouncement);
app.get('/fetch-announcement', fetchAnnouncements);
app.delete('/delete-announcement', deleteAnnouncements);
app.put('/update-announcement/:id', updateAnnouncements);

app.use("/", router);

export default app;