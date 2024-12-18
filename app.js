import pool, { setupDatabase } from './config/db.js';
await setupDatabase();
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { connectToDatabase } from './config/db_mongo.js';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { setupRoutes } from './routes.js';
import {startStreamInWorker, startCleanupInWorker} from './workers/streamWorker.js'
import { runCronJobs } from './crons/schedulers.js';
import { socketEvents } from './utils/socket.js';
import { terminateWorkers } from './workers/streamWorker.js';
config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hlsDirectory = path.join(__dirname, 'hls');

const app = express();
app.use(helmet());
app.use(json());
app.use(cookieParser());


if (!fs.existsSync(hlsDirectory)) {
  fs.mkdirSync(hlsDirectory);
}
// CORS setup
const corsOptions = {
  origin: ['http://localhost:3000',  'https://amarya-admin-code-dev-fe.vercel.app', 'https://amarya-admin-code.vercel.app', 'https://messenger-app-amarya-fe.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-encryption-key', 'x-access-token', '*'],
  credentials: true,
  path: '/',
  exposedHeaders: ['x-encryption-key'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use('/hls', cors(corsOptions), express.static(hlsDirectory));

// Create server and socket.io instance
const server = createServer(app);
const io = new Server(server, {
  reconnection: true, // Enable automatic reconnection
  reconnectionAttempts: Infinity, // Number of reconnection attempts before giving up
  reconnectionDelay: 1000, // Delay before starting the reconnection attempts
  reconnectionDelayMax: 5000, // Maximum delay between reconnections
  timeout: 20000 // Connection timeout
});
socketEvents(io)

// startStreamInWorker(process.env.RTSP_URL, hlsDirectory)
//   .then((message) => console.log(message))
//   .catch((err) => console.error('Stream Error:', err));

// // Start the cleanup in a worker thread
// startCleanupInWorker(hlsDirectory);

// Start the cron jobs
runCronJobs();

// Disable the X-Powered-By header
app.disable('x-powered-by');

app.use(errorHandler);

try {
  await connectToDatabase();
  console.log("Mongo Database connected successfully");
} catch (error) {
  console.error("Mongo Database connection failed:", error);
}
setupRoutes(app) 
// Start the server
const PORT = process.env.PORT || 3000;
// await createOAuth2Client();
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  } else {
    throw err;
  }
});


process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Signal handling for proper cleanup
process.on('SIGINT', () => {
  console.log('Received SIGINT. Cleaning up workers...');
  terminateWorkers();
  io.close(() => console.log('Socket.IO server closed.'));
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Cleaning up workers...');
  terminateWorkers();
  io.close(() => console.log('Socket.IO server closed.'));
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});