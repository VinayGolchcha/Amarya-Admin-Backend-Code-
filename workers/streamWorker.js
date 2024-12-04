import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let workers = [];

export const startStreamInWorker = (rtspUrl, hlsDirectory) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, '../utils/hls.js'));
    workers.push(worker); // Add to the workers array

    worker.postMessage({
      type: 'startStream',
      rtspUrl,
      hlsDirectory,
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


      const index = workers.indexOf(worker);
      if (index > -1) workers.splice(index, 1); // Remove worker from array
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

export const startCleanupInWorker = (hlsDirectory) => {
  const worker = new Worker(path.join(__dirname, '../utils/hls.js'));
  workers.push(worker); // Add to the workers array

  worker.postMessage({
    type: 'cleanup',
    hlsDirectory,
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
    const index = workers.indexOf(worker);
    if (index > -1) workers.splice(index, 1); // Remove worker from array
    if (code !== 0) {
      console.error(`Cleanup worker stopped with exit code ${code}`);
    }
  });
};

// Add a cleanup function for workers
export const terminateWorkers = () => {
  console.log('Terminating workers...');
  workers.forEach((worker) => {
    worker.terminate(); // Terminate each worker
  });
  workers.length = 0; // Clear the array
};