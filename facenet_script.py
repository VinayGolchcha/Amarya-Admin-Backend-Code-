import os
import cv2 as cv
import numpy as np
import base64
import time
import socketio
import pickle
import json
from datetime import datetime
from threading import Thread
from mtcnn import MTCNN
from keras_facenet import FaceNet
from dotenv import load_dotenv
from scipy.special import softmax
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
from python_db_connection import get_cursor
import ast
mydb, mycursor = get_cursor()

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

model_path = './svm_model_160x160_140125_1024.pkl'
with open(model_path, 'rb') as f:
    model = pickle.load(f)

detector = MTCNN()
embedder = FaceNet()

# rtsp_streams = [0]
rtsp_streams = ["rtsp://amarya.ddns.net:5543/5de47dec149522f828aed6711016442a/live/channel0"]
def get_embedding(face_img):
    face_img = face_img.astype('float32')
    face_img = np.expand_dims(face_img, axis=0)
    embedding = embedder.embeddings(face_img)
    return embedding


employees = [
 'ankit_koshta01',
 'ankit_soni01',
 'anmol_chauhan01',
 'anuj.prajapati01',
 'depanshu_kushwaha01',
 'divij_sahu01',
 'eish_nigam01',
 'himanshu_bachwani01',
 'iteesh_dubey01',
 'lucky_soni01',
 'pradyum_jaiswal01',
 'prashant_pandey01',
 'pujita_rao01',
 'saurabh_singh01',
 'shivam_vishwakarma01',
 'shubham_kushwaha01',
 'shubham_soni01',
 'surya_pratap01',
 'tamanna_suhane01',
 'ujjwal_upadhyay01',
 'vishwabhushan_dubey01']


Y = np.asarray(employees)

encoder = LabelEncoder()
encoder.fit(Y)
Y = encoder.transform(Y)


def process_detections(frame, frame_rgb, stream_id, rtsp_url):
    detections = []
    faces = detector.detect_faces(frame_rgb)
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    new_embedding = None  # Initialize new_embedding
    label = ''
    for face in faces:
        x, y, w, h = face['box']
        x, y, w, h = int(x), int(y), int(w), int(h)
        
        face_img = frame_rgb[y:y + h, x:x + w]
        face_img = cv.resize(face_img, (160, 160))
        embedding = get_embedding(face_img)
        # print("embedding.shape", embedding.shape)
        new_embedding = np.array(embedding).reshape(1, 512)  # Ensure it's a 2D array
        # print("new_embedding.shape", new_embedding.shape)
        y_preds = model.predict(new_embedding)

        decision_scores = model.decision_function(new_embedding)
        probabilities = softmax(decision_scores, axis=1)
        confidence = np.max(probabilities, axis=1)
        
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

        color = (0, 255, 0) if confidence_score > 0.5 else (0, 0, 255)
        label = f"{predicted_label} ({confidence_score:.2f})" if confidence_score > 0.5 else "Unknown"
        # print("confidence_score", confidence_score)
        # print("label inside for loop: ", label)
        frame = cv.rectangle(frame, (x, y), (x + w, y + h), color, 2)
        cv.putText(frame, label, (x, y - 10), cv.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    # print("label: ", label)
    if new_embedding is not None and label == "Unknown":  # Ensure new_embedding is not None
        db_embeddings = mycursor.execute("SELECT embedding FROM embeddings WHERE DATE(created_at) = CURDATE()")
        db_embeddings = mycursor.fetchall()
        
        if db_embeddings:  # Ensure there are embeddings in the database
            deserialize_embeddings = [np.array(json.loads(embedding[0])) for embedding in db_embeddings]
            deserialize_embeddings = np.vstack(deserialize_embeddings)
            # print("deserialize_embeddings_again", deserialize_embeddings)
            cosine_similarities = cosine_similarity(deserialize_embeddings, new_embedding)
            print("cosine_similarities", cosine_similarities)
            print("cosine_similarities_value", np.max(cosine_similarities))
            if np.max(cosine_similarities) > 0.5:
                pass  # Ignore the incoming face
            else:
                # print("new_embedding inside else else", new_embedding)
                _, buffer = cv.imencode('.jpg', frame)
                frame_data = base64.b64encode(buffer.tobytes()).decode('utf-8')
                sio.emit('detections', {
                    'detections': detections,
                    'rtsp_url': rtsp_url,
                    'stream_id': stream_id,
                    'image': frame_data
                })
                mycursor.execute(
                    "INSERT INTO embeddings(embedding) VALUES (%s)",
                    (json.dumps(new_embedding.tolist()),)
                )
                mydb.commit()
        else:
            # print("new_embedding inside else",new_embedding)
            _, buffer = cv.imencode('.jpg', frame)
            frame_data = base64.b64encode(buffer.tobytes()).decode('utf-8')
            sio.emit('detections', {
                'detections': detections,
                'rtsp_url': rtsp_url,
                'stream_id': stream_id,
                'image': frame_data
            })
            mycursor.execute(
                "INSERT INTO embeddings(embedding) VALUES (%s)",
                (json.dumps(new_embedding.tolist()),)
            )
            mydb.commit()
    if detections and label != "Unknown":
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
            cap.set(cv.CAP_PROP_FRAME_WIDTH, 1920)
            cap.set(cv.CAP_PROP_FRAME_HEIGHT, 1080)
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
