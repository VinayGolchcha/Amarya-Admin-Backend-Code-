
import { setupDatabase } from './config/db.js';
await setupDatabase();
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import userRoutes from './v1/user/routes/userRoutes.js'
import assetRoutes from './v1/asset/routes/assetRoutes.js'

const app = express();
config();
app.use(json());
app.use(cors());

// Import & Define API versions
app.use('/api/v1', userRoutes);
app.use('/api/v1', assetRoutes);
app.use('/', (req, res) => {
  res.send("Hey, I'm online now!!")
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
