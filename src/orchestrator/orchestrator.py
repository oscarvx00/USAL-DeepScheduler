#!/usr/bin/env python
from io import BytesIO
import json
import re
import time
import pika
import docker
import os
from minio import Minio
from pymongo import MongoClient
import mongoHandler

RABBIT_HOST = os.environ['RABBIT_HOST']
REQUEST_QUEUE = os.environ['REQUEST_QUEUE']

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
        return TrainingRequest(jsonDict['_id'],jsonDict['user'], jsonDict['status'], jsonDict['computingTime'], jsonDict['imageName'])
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Request: [requestId: " + str(self._id) + " userID: " + str(self.user) + ", status: " + self.status + ", executionTime: " + str(self.computingTime) + ", imageName: " + self.imageName + " ]\n"




#Get docker socket client
dockerClient = docker.from_env()

#Create Minio client
minioClient = Minio(
    MINIO_CLIENT,
    access_key=MINIO_ACCESS,
    secret_key=MINIO_SECRET
)

#Create MongoDB client
#mongoClient = MongoClient(host='localhost', port=30002)
mongoClient = MongoClient(host=MONGO_HOST)
mongoDatabase = mongoClient.ds



#Create connection to RabbitMQ container based on its service name
#connection = pika.BlockingConnection(
#    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0, port=30001))
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0))
channel = connection.channel()
channel.queue_declare(queue=REQUEST_QUEUE, durable=True)

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
        container.reload()
        #Optional: upload logs in a periodic time so that users can check them in almost real time
        #out = container.logs(stdout=True, stderr=False)
        #print(out.decode(), flush=True)
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
        time.sleep(10)


    container.stop()
    #Check exit code, logs, etc
    out = container.logs(stdout=True, stderr=False)
    err = container.logs(stdout=False, stderr=True)
    #print("\n\n===========CONTAINER LOGS=============\n\n", flush=True)
    #print(out.decode(), flush=True)
    #print(err.decode(), flush=True)

    #Get results
    strm, stat = container.get_archive(path="/train/results")
    file_obj = BytesIO()
    for i in strm:
        file_obj.write(i)
    file_obj.seek(0)

    #Upload files, logs
    resultsPath = str(trainingRequest.user) + "/" + str(trainingRequest._id) + "/results.tar"
    minioClient.put_object(
        MINIO_RESULTS_BUCKET, resultsPath, file_obj, length=file_obj.getbuffer().nbytes
    )

    outLogPath = str(trainingRequest.user) + "/" + str(trainingRequest._id) + "/logs/out.log"
    f = open("outLog.log", "x")
    f.write(out.decode())
    f.close()
    minioClient.fput_object(
        MINIO_RESULTS_BUCKET, outLogPath, "outLog.log"
    )
    os.remove("outLog.log")

    errLogPath = str(trainingRequest.user) + "/" + str(trainingRequest._id) + "/logs/err.log"
    f = open("errLog.log", "x")
    f.write(err.decode())
    f.close()
    minioClient.fput_object(
        MINIO_RESULTS_BUCKET, errLogPath, "errLog.log"
    )
    os.remove("errLog.log")

    #TODO: Send container finished to web app

    #Save status in database
    mongoHandler.setRequestCompleted(mongoDatabase, trainingRequest._id)

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
channel.basic_consume(REQUEST_QUEUE, auto_ack=False, on_message_callback=callback)
channel.start_consuming()