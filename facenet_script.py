import os
import cv2 as cv
import numpy as np
import base64
import time
import socketio
import pickle
from datetime import datetime
from threading import Thread
from mtcnn.mtcnn import MTCNN
from keras_facenet import FaceNet
from dotenv import load_dotenv
from scipy.special import softmax
from sklearn.preprocessing import LabelEncoder

load_dotenv()
print("Python script has started running")
environment = os.getenv('NODE_ENV', 'development')

if environment == 'production':
    server_url = os.getenv('PROD_SERVER_URL')
else:
    server_url = os.getenv('LOCAL_SERVER_URL')

sio = socketio.Client(reconnection=True)

def connect_to_server():
    retry_interval = 5
    max_interval = 60 
    
    while True:
        try:
            print(f"Connecting to Node.js server using: {server_url}")
            sio.connect(server_url)
            print("Connected to Node.js server")
            break 
        except Exception as e:
            print(f"Error connecting to Node.js server: {e}")
            time.sleep(retry_interval)
            retry_interval = min(max_interval, retry_interval * 2)

@sio.event
def connect():
    print("Connected to Node.js server")

@sio.event
def disconnect():
    print("Disconnected from Node.js server")

@sio.event
def reconnect_attempt(attempt_number):
    print(f"Attempting to reconnect... Attempt number: {attempt_number}")

model_path = './svm_model_160x160.pkl'
with open(model_path, 'rb') as f:
    model = pickle.load(f)

detector = MTCNN()
embedder = FaceNet()

rtsp_streams = [0]

def get_embedding(face_img):
    face_img = face_img.astype('float32')
    face_img = np.expand_dims(face_img, axis=0)
    yhat = embedder.embeddings(face_img)
    return yhat[0]


employees = ['rashi_agarwal', 'rashi_agarwal', 'rashi_agarwal', 'rashi_agarwal',
       'pujita_rao01', 'pujita_rao01', 'pujita_rao01', 'ankit_koshta01',
       'ankit_koshta01', 'ankit_koshta01', 'ankit_koshta01',
       'ankit_koshta01', 'ankit_koshta01', 'ankit_koshta01',
       'ankit_koshta01', 'ankit_koshta01', 'ankit_koshta01',
       'ankit_koshta01', 'kishanlal_chaurasiya01',
       'kishanlal_chaurasiya01', 'kishanlal_chaurasiya01',
       'anmol_chauhan01', 'anmol_chauhan01', 'anmol_chauhan01',
       'anmol_chauhan01', 'anmol_chauhan01', 'anuj.prajapati01',
       'anuj.prajapati01', 'anuj.prajapati01', 'anuj.prajapati01',
       'eish_nigam01', 'eish_nigam01', 'eish_nigam01', 'eish_nigam01',
       'divij_sahu01', 'divij_sahu01', 'divij_sahu01',
       'prashant_pandey01', 'prashant_pandey01', 'prashant_pandey01',
       'prashant_pandey01', 'prashant_pandey01', 'prashant_pandey01',
       'prashant_pandey01', 'prashant_pandey01', 'prashant_pandey01',
       'prashant_pandey01', 'prashant_pandey01', 'prashant_pandey01',
       'prashant_pandey01', 'prashant_pandey01', 'shubham_kushwaha01',
       'shubham_kushwaha01', 'iteesh_dubey01', 'iteesh_dubey01',
       'iteesh_dubey01', 'iteesh_dubey01', 'iteesh_dubey01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'ujjwal_upadhyay01', 'ujjwal_upadhyay01',
       'ujjwal_upadhyay01', 'yogesh', 'yogesh', 'yogesh', 'yogesh',
       'yogesh', 'yogesh', 'yogesh', 'yogesh', 'yogesh', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'surya_pratap01', 'surya_pratap01', 'surya_pratap01',
       'tamanna_suhane01', 'tamanna_suhane01', 'tamanna_suhane01',
       'tamanna_suhane01', 'tamanna_suhane01', 'tamanna_suhane01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01', 'shubham_soni01',
       'shubham_soni01', 'shubham_soni01']


Y = np.asarray(employees)

encoder = LabelEncoder()
encoder.fit(Y)
Y = encoder.transform(Y)

def process_detections(frame, frame_rgb, stream_id, rtsp_url):
    detections = []
    faces = detector.detect_faces(frame_rgb)
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    for face in faces:
        x, y, w, h = face['box']
        x, y = abs(x), abs(y)
        
        x, y, w, h = int(x), int(y), int(w), int(h)
        
        face_img = frame_rgb[y:y + h, x:x + w] # t_im
        face_img = cv.resize(face_img, (160, 160))
        embedding = get_embedding(face_img)
        embedding = [embedding]

        y_preds = model.predict(embedding)
        
        
        decision_scores = model.decision_function(embedding)  # Raw scores
        probabilities = softmax(decision_scores, axis=1) 
        confidence = np.max(probabilities, axis=1)
        
        ## new
        # print(confidence)
        print(encoder.inverse_transform(y_preds))

        predicted_label = encoder.inverse_transform(y_preds)[0]
        confidence_score = confidence[0]

        detection = {
            "class_name": predicted_label if confidence_score > 0.5 else "Unknown",
            "confidence": confidence_score,
            "bounding_box": {
                "x1": x,
                "y1": y,
                "x2": x + w,
                "y2": y + h
            },
            "detection_time": current_time
        }
        detections.append(detection)

        # Draw bounding box and label
        color = (0, 255, 0) if confidence_score > 0.5 else (0, 0, 255)
        label = f"{predicted_label} ({confidence_score:.2f})" if confidence_score > 0.5 else "Unknown"
        frame = cv.rectangle(frame, (x, y), (x + w, y + h), color, 2)
        cv.putText(frame, label, (x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    # Emit detections to the Node.js server
    if detections:
        _, buffer = cv.imencode('.jpg', frame)
        frame_data = base64.b64encode(buffer.tobytes()).decode('utf-8')

        sio.emit('detections', {
            'detections': detections,
            'rtsp_url': rtsp_url,
            'stream_id': stream_id,
            'image': frame_data
        })

    return frame


def process_stream(rtsp_url, stream_id):
    print(f"Processing stream {stream_id}: {rtsp_url}")
    cap = None

    while True:
        try:
            cap = cv.VideoCapture(rtsp_url)
            cap.set(cv.CAP_PROP_BUFFERSIZE, 10)

            while True:
                ret, frame = cap.read()
                if not ret:
                    print(f"Failed to capture frame from stream {stream_id}. Reconnecting...")
                    break

                frame_rgb = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
                frame = process_detections(frame, frame_rgb, stream_id, rtsp_url)

                # Display the frame locally
                # cv.imshow(f"Stream {stream_id}", frame)

                # Exit loop if 'q' is pressed
                if cv.waitKey(1) & 0xFF == ord('q'):
                    print("Exiting...")
                    return

        except Exception as e:
            print(f"Error processing stream {stream_id}: {e}")
        finally:
            if cap is not None:
                cap.release()
            cv.destroyAllWindows()
            time.sleep(5)  # Retry after a brief pause

def start_streams():
    print("Starting streams")
    threads = []
    for i, rtsp_url in enumerate(rtsp_streams):
        thread = Thread(target=process_stream, args=(rtsp_url, i))
        thread.daemon = True
        threads.append(thread)
        thread.start()

if __name__ == '__main__':
    connect_to_server()
    start_streams()
    while True:
        time.sleep(1)
