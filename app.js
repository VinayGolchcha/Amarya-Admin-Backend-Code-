
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
import policiesRoutes from "./v1/policies/routes/policiesRoutes.js"
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn, exec } from 'child_process';
import path from 'path';
import os from 'os';
import { installConda, setupEnvironment } from './install.js';
import { saveAttendanceLogs } from './v1/attendance/controllers/attendanceController.js';
config()
await installConda();
await setupEnvironment();
const app = express();
app.use(helmet());
app.use(json());
// CORS setup
app.use(cookieParser());
const corsOptions = {
  origin: ['http://localhost:3000', 'https://amarya-admin-code-dev-fe.vercel.app', 'https://amarya-admin-code.vercel.app'], // replace with your client URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-encryption-key', 'x-access-token'],
  credentials: true,
  path: '/',
  exposedHeaders: ['x-encryption-key'],
};
const server = createServer(app);
const io = new Server(server);
const condaPath = path.join(os.homedir(), os.platform() === 'win32' ? 'Miniconda3' : 'miniconda3', 'condabin', os.platform() === 'win32' ? 'conda.bat' : 'conda');
const pythonProcess = spawn(condaPath, ['run', '-n', 'conda_env', 'python', 'script.py']);
io.on('connection', (socket) => {
  console.log('Client connected');

  pythonProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('output', output);
    socket.emit('python_output', output);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    if (code !== 0) {
        console.error('Python script crashed. Restarting...');
        pythonProcess = spawn(condaPath, ['run', '-n', 'conda_env', 'python', 'script.py']);
    }
  });

  socket.on('detections', async (data) => {
    console.log('Received detections:', data.detections.class_name);
    console.log('Received detections:', data.detections.confidence);
    console.log('Received detections:', data.detections.bounding_box);
    console.log('Received URL:', data.rtsp_url);
    console.log('stream_id :', data.stream_id); 

    // if(data.stream_id !== 0){
      // await checkCameraStatus();
    // }

    // filtering unique data
    let filterDuplicateDate = Object.values(
      data.detections.reduce((acc, item) => {
        acc[item.class_name] = item;
        return acc;
      }, {})
    );

    // save attedance and update out time
    await saveAttendanceLogs(filterDuplicateDate);

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    if (pythonProcess && !pythonProcess.killed) {
        pythonProcess.kill('SIGINT');
    }
  });
});
io.on('error', (err) => {
  console.error('Socket.io error:', err);
});
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
app.use('/', (req, res) => {
  res.send({
    statusCode: 403,
    status: 'failure',
    message: 'Invalid API'
  })
});
app.use(errorHandler)

try {
  await connectToDatabase();
  console.log("Mongo Database connected successfully");
} catch (error) {
  console.error("Mongo Database connection failed:", error);
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
