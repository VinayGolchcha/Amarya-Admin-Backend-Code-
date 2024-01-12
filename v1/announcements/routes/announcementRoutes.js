import express, { Router } from 'express';
const app = express()
const router = Router();
import {createAnnouncement, fetchAnnouncements, deleteAnnouncements, updateAnnouncements} from '../controllers/announcementController.js';



app.post('/admin/add-announcement', createAnnouncement);
app.get('/admin/fetch-announcement', fetchAnnouncements);
app.delete('/admin/delete-announcement', deleteAnnouncements);
app.put('/admin/update-announcement/:id', updateAnnouncements);

app.use("/", router);

export default app;