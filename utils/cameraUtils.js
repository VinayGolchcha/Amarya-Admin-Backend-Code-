import ffmpeg from 'fluent-ffmpeg'; 
import ffmpegPath from 'ffmpeg-static'; 

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Function to check camera status
export const checkCameraStatus = () => {
  return new Promise((resolve, reject) => {
    ffmpeg("rtsp://192.168.1.28:5543/c09aa8be6a70054108fb66336c2b82c9/live/channel0")
      .on('start', () => {
        console.log('Attempting to connect to the camera...');
      })
      .on('error', (err) => {
        console.log('Camera is offline or unreachable.');
        resolve(false); // Camera is offline
      })
      .on('end', () => {
        console.log('Camera is online and accessible.');
        resolve(true); // Camera is online
      })
      .addOutputOptions('-t 1') // Add a short timeout to avoid hanging
      .output('/dev/null') // Use a dummy output
      .run();
  });
};
