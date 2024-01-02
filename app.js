
// import { setupDatabase } from './config/db.js';
// await setupDatabase();
import express, { json } from 'express';
import { config } from 'dotenv';
import cors from 'cors';

const app = express();
config();
app.use(json());
app.use(cors());
// Import & Define API versions

app.use('/', (req, res) => {
  res.send("Hey, I'm online now!!")
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
