import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
export const startStream = (rtspUrl, hlsDirectory) => {
    const ffmpeg = spawn('ffmpeg', [
      '-rtsp_transport', 'tcp',
      '-i', rtspUrl,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '24',
      '-f', 'hls',
      '-hls_time', '10',
      '-hls_list_size', '6',
      path.join(hlsDirectory, 'stream.m3u8'),
    ]);
  
    ffmpeg.stderr.on('data', (data) => console.error(`FFmpeg stderr: ${data}`));
    ffmpeg.on('close', (code) => console.log(`FFmpeg exited with code ${code}`));
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
  