#!/usr/bin/env python
from cProfile import label
from io import BytesIO
import json
import tarfile
import time
import uuid
import zipfile
import pika
import docker
import os
from minio import Minio
from pymongo import MongoClient
import mongoHandler
from enum import Enum
import shutil

RABBIT_HOST = os.environ['RABBIT_HOST']
#REQUEST_QUEUE = os.environ['REQUEST_QUEUE']

MINIO_CLIENT = os.environ['MINIO_CLIENT']
MINIO_ACCESS = os.environ['MINIO_ACCESS']
MINIO_SECRET = os.environ['MINIO_SECRET']
MINIO_RESULTS_BUCKET = os.environ['MINIO_RESULTS_BUCKET']

MONGO_HOST = os.environ['MONGO_HOST'] 


class TrainingRequest:
    def __init__(self, _id, user, status,computingTime, imageName):
        self._id = _id
        self.user = user
        self.status = status
        self.computingTime = computingTime
        self.imageName = imageName

    def fromJson(jsonDict):
        #print(jsonDict)
        return TrainingRequest(jsonDict['_id'],jsonDict['user'], jsonDict['status'], jsonDict['computingTime'], jsonDict['imageName'])
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Request: [requestId: " + str(self._id) + " userID: " + str(self.user) + ", status: " + self.status + ", executionTime: " + str(self.computingTime) + ", imageName: " + self.imageName + " ]\n"


class LogMessage:
    def __init__(self, requestId, log):
        self.requestId = requestId
        self.log = log
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class RabbitMessageType(str, Enum):
    REQUEST_STATUS: str = "request_status"
    REQUEST_LOGS: str = "request_logs"

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


class RabbitMessage:
    def __init__(self, type : RabbitMessageType, userId, message):
        self.type = type
        self.userId = userId
        self.message = message

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)


def rabbitSendUpdate(message : RabbitMessage):
    channel.basic_publish(
    exchange='orchestrator_msgs_exchange', routing_key=str(message.userId), body=message.toJson())


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), 
                       os.path.relpath(os.path.join(root, file), 
                                       os.path.join(path, '..')))




orchestrator_id = str(uuid.uuid1())
orchestrator_cancel_queue_name = "cancel_queue_" + orchestrator_id

#Get docker socket client
dockerClient = docker.from_env()

#Create Minio client
minioClient = Minio(
    MINIO_CLIENT,
    access_key=MINIO_ACCESS,
    secret_key=MINIO_SECRET
)

#Create MongoDB client
mongoClient = MongoClient(host='localhost', port=30002)
#mongoClient = MongoClient(host=MONGO_HOST)
mongoDatabase = mongoClient.ds

workerId = str(mongoHandler.registerWorker(mongoDatabase, "TEST"))


#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0, port=30001))
#connection = pika.BlockingConnection(
#    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0))
channel = connection.channel()

#Incoming training requests
worker_queue = "worker_queue_" + workerId
channel.exchange_declare(exchange="workers_exchange", exchange_type='direct', durable=False)
channel.queue_declare(queue=worker_queue, durable=False)
channel.queue_bind(exchange='workers_exchange', queue=worker_queue, routing_key=workerId)

#Logs and status updates
channel.exchange_declare(exchange='orchestrator_msgs_exchange', exchange_type='topic', durable=True)

#Declare cancel queue and exchange
channel.exchange_declare(exchange='cancel_training_exchange', exchange_type='fanout', durable=False)
channel.queue_declare(queue=orchestrator_cancel_queue_name, durable=True)
channel.queue_bind(exchange='cancel_training_exchange', queue=orchestrator_cancel_queue_name)

#Create user-results bucket if not exists
found = minioClient.bucket_exists(bucket_name=MINIO_RESULTS_BUCKET)
if not found:
    minioClient.make_bucket(MINIO_RESULTS_BUCKET)

print(' [*] Queue declared, waiting for messages')


def callback(ch, method, properties, body):

    #Decode Request data
    rawJson = json.loads(body)
    trainingRequest = TrainingRequest.fromJson(mongoHandler.getRequestById(mongoDatabase, rawJson['id']))
    print('\n\n [x] Received image: ', trainingRequest._id, flush=True)
    
    #Check if state is scheduled, if not discard
    if trainingRequest.status != "SCHEDULED":
        #Discard
        print('\n [-] State is not scheduled: ', trainingRequest._id, flush=True)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    #Set current state to executing
    imageUpdated = TrainingRequest.fromJson(mongoHandler.setRequestExecuting(mongoDatabase, trainingRequest._id))
    requestUserId = str(imageUpdated.user)
    rabbitSendUpdate(RabbitMessage(RabbitMessageType.REQUEST_STATUS, requestUserId, imageUpdated))

    #Image execution control.

    #Download image
    try: 
        image = dockerClient.images.pull(trainingRequest.imageName)
    except:
        print("\n [-]Error pulling " + trainingRequest.imageName, flush=True)
        #TODO: Send error message to web app
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    print(" [x] Image " + trainingRequest.imageName + " pulled")


    #Create a container with gpu capabilities.
    container = dockerClient.containers.run(image=trainingRequest.imageName, detach="True", device_requests=[
        docker.types.DeviceRequest(count=-1, capabilities=[['gpu']])
    ])

    #Get start time
    start_time = time.time()

    #Enter in a loop until max time is reached or container has exited
    while True:

        #Check if execution canceled
        _, _, msg = channel.basic_get(orchestrator_cancel_queue_name, auto_ack=True)
        if msg != None:
            cancelId = json.loads(msg.decode('utf-8'))['id']
            if str(cancelId) == str(trainingRequest._id):
                container.stop()
                imageUpdated = TrainingRequest.fromJson(mongoHandler.setRequestCanceled(mongoDatabase, trainingRequest._id))
                rabbitSendUpdate(RabbitMessage(RabbitMessageType.REQUEST_STATUS, requestUserId, imageUpdated))
                ch.basic_ack(delivery_tag=method.delivery_tag)
                return


        container.reload()
        #Optional: upload logs in a periodic time so that users can check them in almost real time
        logs = container.logs(stdout=True, stderr=True, tail=50).decode()
        #logs = logs.replace('\n', '\\n')
        #print(logs.decode(), flush=True)
        rabbitSendUpdate(RabbitMessage(RabbitMessageType.REQUEST_LOGS, requestUserId, LogMessage(str(trainingRequest._id),logs)))
        current_time = time.time()
        elapsed_time = current_time - start_time
        if elapsed_time > float(trainingRequest.computingTime):
            #If max time reached exit from loop
            print(" [x] Max execution time reached")
            break
        elif container.status == "exited":
            print(" [x] Container exited")
            break
        #Sleep 10 seconds to prevent high cpu usage
        time.sleep(3)

    final_time = time.time()
    #Stored for stats purposes
    completed_computing_time = final_time - start_time
    print(" [x] Total time: ", completed_computing_time)

    container.stop()
    #Check exit code, logs, etc

    #Create directory for container data
    current_directory = '/tmp/container_results'
    container_data_directory = os.path.join(current_directory, str(trainingRequest._id))
    if not os.path.exists(container_data_directory):
        os.makedirs(container_data_directory)

    #Get results
    strm, stat = container.get_archive(path="/train/results")
    file_obj = BytesIO()
    for i in strm:
        file_obj.write(i)
    file_obj.seek(0)

    with open(os.path.join(container_data_directory, 'results.tar'), 'wb') as outfile:
        outfile.write(file_obj.getbuffer())

    #Extract tar file
    results_tar = tarfile.open(os.path.join(container_data_directory, 'results.tar'))
    results_tar.extractall(path=os.path.join(container_data_directory))
    results_tar.close()
    os.remove(os.path.join(container_data_directory, 'results.tar'))


    #Get logs from container
    out = container.logs(stdout=True, stderr=False)
    err = container.logs(stdout=False, stderr=True)

    f = open(os.path.join(container_data_directory, "outLog.log"), "x")
    f.write(out.decode())
    f.close()

    f = open(os.path.join(container_data_directory, "errLog.log"), "x")
    f.write(err.decode())
    f.close()

    #Make zip
    zip_path = os.path.join('/tmp',str(trainingRequest._id)+'.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir(container_data_directory, zipf)

    #Upload zip to minio
    minio_path = str(trainingRequest.user) + "/" + str(trainingRequest._id)+'.zip'
    print("Uploading " + zip_path +" ---> " + minio_path, flush=True)
    minioClient.fput_object(
        MINIO_RESULTS_BUCKET, minio_path, zip_path
    )
    print("Object uploaded", flush=True)

    #Remove container data from system
    os.remove(zip_path)
    shutil.rmtree(container_data_directory)


    #Save status in database
    imageUpdated = TrainingRequest.fromJson(mongoHandler.setRequestCompleted(mongoDatabase, trainingRequest._id, completed_computing_time))
    rabbitSendUpdate(RabbitMessage(RabbitMessageType.REQUEST_STATUS, requestUserId, imageUpdated))

    #Remove container, remove image
    try:
        container.remove()
        dockerClient.images.remove(image.id)
    except:
        print("Error removing image or container", flush=True)

    print("\n=========== Request " + str(trainingRequest._id)+ " completed ===========\n\n\n", flush=True)

    #Ack message
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(worker_queue, auto_ack=False, on_message_callback=callback)

channel.start_consuming()