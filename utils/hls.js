import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { parentPort } from 'worker_threads';
export const startStream = (rtspUrl, hlsDirectory) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport', 'tcp',
      '-i', rtspUrl, 
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '24',
      '-f', 'hls',
      '-hls_time', '10',
      '-hls_list_size', '6',
      path.join(hlsDirectory, 'stream.m3u8')
    ]);

    ffmpeg.on('error', (err) => {
      parentPort.postMessage({ type: 'error', message: `FFmpeg error: ${err.message}` });
      reject(err);
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        parentPort.postMessage({ type: 'success', message: 'Stream started successfully' });
        resolve();
      } else {
        parentPort.postMessage({ type: 'error', message: `FFmpeg exited with code ${code}` });
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });
  });
};
  
export const cleanupSegments = (hlsDirectory, maxSegments = 6) => {
  setInterval(() => {
    const files = fs.readdirSync(hlsDirectory)
      .filter(file => file.endsWith('.ts'))
      .sort((a, b) => fs.statSync(path.join(hlsDirectory, a)).mtime - fs.statSync(path.join(hlsDirectory, b)).mtime);

    if (files.length > maxSegments) {
      files.slice(0, files.length - maxSegments)
        .forEach(file => fs.unlinkSync(path.join(hlsDirectory, file)));
    }
  }, 10000);
};

parentPort.on('message', (msg) => {
    if (msg.type === 'startStream') {
      startStream(msg.rtspUrl, msg.hlsDirectory);
    } else if (msg.type === 'cleanup') {
      cleanupSegments(msg.hlsDirectory);
    }
});