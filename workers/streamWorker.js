import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const startStreamInWorker = (rtspUrl, hlsDirectory) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, '../utils/hls.js'));
  
      // Send message to the worker to start the stream
      worker.postMessage({
        type: 'startStream',
        rtspUrl,
        hlsDirectory
      });
  
      worker.on('message', (message) => {
        if (message.type === 'error') {
          reject(message.message);
        } else if (message.type === 'success') {
          resolve(message.message);
        }
      });
  
      worker.on('error', (err) => {
        reject(err);
      });
  
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
};


export const startCleanupInWorker = (hlsDirectory) => {
    const worker = new Worker(path.join(__dirname, '../utils/hls.js'));

    worker.postMessage({
        type: 'cleanup',
        hlsDirectory
    });

    worker.on('message', (message) => {
        if (message.type === 'error') {
        console.error(message.message);
        }
    });

    worker.on('error', (err) => {
        console.error(err);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
        console.error(`Cleanup worker stopped with exit code ${code}`);
        }
    });
};