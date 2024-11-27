import pool, { setupDatabase } from './config/db.js';
await setupDatabase();
import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { errorHandler } from './middlewares/errorMiddleware.js';
import { connectToDatabase } from './config/db_mongo.js';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './v1/users/routes/userRoutes.js';
import assetRoutes from './v1/assets/routes/assetRoutes.js';
import trainingRoutes from './v1/trainings/routes/trainingRoutes.js';
import approvalRoutes from './v1/approvals/routes/approvalRoutes.js';
import announcementRoutes from './v1/announcements/routes/announcementRoutes.js';
import leaveRoutes from './v1/leaves/routes/leaveRoutes.js';
import worksheetRoutes from './v1/worksheets/routes/worksheetRoutes.js';
import teamRoutes from './v1/teams/routes/teamRoutes.js';
import categoryRoutes from './v1/categories/routes/categoryRoutes.js';
import projectRoutes from './v1/projects/routes/projectRoutes.js';
import skillSetRoutes from './v1/skillsets/routes/skillsetRoutes.js';
import stickynotesRoutes from "./v1/stickynotes/routes/stickynotesRoutes.js";
import activityRoutes from "./v1/activity/routes/activityRoutes.js";
import dashboardRoutes from "./v1/dashboard/routes/dashboardRoutes.js";
import { runCronJobs } from './crons/schedulers.js';
import userDashboardRoutes from './v1/users/routes/userdashboardRoutes.js';
import policiesRoutes from "./v1/policies/routes/policiesRoutes.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { saveAttendanceLogs } from './v1/attendance/controllers/attendanceController.js';
import attendanceRoutes from './v1/attendance/routes/attendanceRoutes.js';
import { authenticate, createOAuth2Client } from './utils/googleDriveUploads.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('detections', async (data) => {
    console.log('Received detections:', data.detections[0].class_name);
    console.log('Received detections:', data.detections[0].confidence);
    console.log('Received detections:', data.detections[0].bounding_box);
    console.log('Received time:', data.detections[0].detection_time);
    console.log('Received URL:', data.rtsp_url);
    console.log('stream_id:', data.stream_id); 

    // Filter unique data
    let filterDuplicateDate = Object.values(
      data.detections.reduce((acc, item) => {
        acc[item.class_name] = item;
        return acc;
      }, {})
    );

    if (data.detections[0].confidence > 0.50) {
      await saveAttendanceLogs(filterDuplicateDate);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('forceDisconnect', () => {
    console.log('Forcefully disconnecting the client...');
    socket.disconnect();
  });

  socket.on('error', (err) => {
    console.error('Socket.io error:', err);
  });
});

// Handle reconnection events
io.on('reconnect_attempt', (attemptNumber) => {
  console.log(`Reconnection attempt #${attemptNumber}`);
});

io.on('reconnect', () => {
  console.log('Reconnected to WebSocket server');
});

io.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});

io.on('reconnect_failed', () => {
  console.error('Failed to reconnect to WebSocket server');
});


const startStream = () => {
  const rtspUrl = 'rtsp://amarya.ddns.net:5543/5de47dec149522f828aed6711016442a/live/channel0'; // RTSP feed URL

  // Spawn an FFmpeg process to convert RTSP stream to HLS
  const ffmpeg = spawn('ffmpeg', [
    '-rtsp_transport', 'tcp',
    '-i', rtspUrl, // The RTSP URL
    '-c:v', 'libx264', // Video codec (H.264)
    '-preset', 'veryfast',
    '-crf', '24', // Compression quality (0 = lossless)
    '-f', 'hls',
    '-hls_time', '10', // Segment duration in seconds
    '-hls_list_size', '6', // Number of playlist entries
    path.join(hlsDirectory, 'stream.m3u8') // Output path for the HLS manifest
  ]);

  ffmpeg.stderr.on('data', (data) => {
    // console.error(`FFmpeg stderr: ${data.toString()}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
  });
};

setInterval(() => {
  const files = fs.readdirSync(hlsDirectory)
    .filter(file => file.endsWith('.ts')) // Only segment files
    .sort((a, b) => fs.statSync(path.join(hlsDirectory, a)).mtime - fs.statSync(path.join(hlsDirectory, b)).mtime);
  let maxSegments = 6
  if (files.length > maxSegments) {
    const filesToDelete = files.slice(0, files.length - maxSegments);
    filesToDelete.forEach(file => fs.unlinkSync(path.join(hlsDirectory, file)));
  }
}, 10000); // Check every 10 seconds
// Start the stream
startStream();


// Start the cron jobs
runCronJobs();

// Disable the X-Powered-By header
app.disable('x-powered-by');

// Import & Define API versions
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/asset', assetRoutes);
app.use('/api/v1/training', trainingRoutes);
app.use('/api/v1/approval', approvalRoutes);
app.use('/api/v1/announcement', announcementRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/worksheet', worksheetRoutes);
app.use('/api/v1/team', teamRoutes);
app.use('/api/v1/skillSet', skillSetRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/project', projectRoutes);
app.use("/api/v1/stickynotes", stickynotesRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/policy", policiesRoutes);
app.use("/api/v1/userDashboard", userDashboardRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use('/', (req, res) => {
  res.status(403).json({
    statusCode: 403,
    status: 'failure',
    message: 'Invalid API'
  })
});
app.use(errorHandler);

try {
  await connectToDatabase();
  console.log("Mongo Database connected successfully");
} catch (error) {
  console.error("Mongo Database connection failed:", error);
}

// Start the server
const PORT = process.env.PORT || 3000;
// await createOAuth2Client();
server.listen(PORT, async () => {
  // await authenticate()
  console.log(`Server running at http://localhost:${PORT}`);
});
