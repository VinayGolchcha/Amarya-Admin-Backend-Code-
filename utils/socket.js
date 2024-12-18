import { saveAttendanceLogs } from "../v1/attendance/controllers/attendanceController.js";


export const socketEvents = (io) => {
    io.on('connection', (socket) => {
      console.log('Client connected');
  
      socket.on('detections', async (data) => {
        console.log('Received class_name:', data.detections[0].class_name);
        console.log('Received confidence:', data.detections[0].confidence);
        console.log('Received bounding_box:', data.detections[0].bounding_box);
        console.log('Received detection_time:', data.detections[0].detection_time);
        console.log('Received URL:', data.rtsp_url);
        console.log('stream_id:', data.stream_id);
        // console.log('Received frame_data:', data.image);
        if (data.detections[0]?.confidence > 0.50) {
          const uniqueData = Object.values(
            data.detections.reduce((acc, item) => {
              // acc[item.class_name] = item;

              acc[item.class_name] = { 
                ...item, 
                image: data.image
              };


              return acc;
            }, {})
          );
          await saveAttendanceLogs(uniqueData);
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
};
  