
import { setupDatabase } from './config/db.js';
await setupDatabase();
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import userRoutes from './v1/users/routes/userRoutes.js'
import assetRoutes from './v1/assets/routes/assetRoutes.js'
import trainingRoutes from './v1/trainings/routes/trainingRoutes.js'
import approvalRoutes from './v1/approvals/routes/approvalRoutes.js'
import announcementRoutes from './v1/announcements/routes/announcementRoutes.js';
import leaveRoutes from './v1/leaves/routes/leaveRoutes.js';

const app = express();
config();
app.use(json());
app.use(cors());
// Disable the X-Powered-By header
app.disable('x-powered-by');
// Import & Define API versions
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/asset', assetRoutes);
app.use('/api/v1/training', trainingRoutes);
app.use('/api/v1/approval', approvalRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/', (req, res) => {
  res.send("Hey, I'm online now!!")
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
