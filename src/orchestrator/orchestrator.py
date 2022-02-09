#!/usr/bin/env python
from asyncio import constants
from io import BytesIO
import json
import time
import pika
from request import Request
import docker
import os
from minio import Minio

RABBIT_HOST = os.environ['RABBIT_HOST']
REQUEST_QUEUE = os.environ['REQUEST_QUEUE']

MINIO_CLIENT = os.environ['MINIO_CLIENT']
MINIO_ACCESS = os.environ['MINIO_ACCESS']
MINIO_SECRET = os.environ['MINIO_SECRET']
MINIO_RESULTS_BUCKET = os.environ['MINIO_RESULTS_BUCKET']

#Get docker socket client
dockerClient = docker.from_env()

#Create Minio client
minioClient = Minio(
    MINIO_CLIENT,
    access_key=MINIO_ACCESS,
    secret_key=MINIO_SECRET
)

#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST))
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
    request = Request.fromJson(rawJson)
    print('\n\n [x] Received image: ', request, flush=True)

    #Image execution control.

    #Download image
    try: 
        image = dockerClient.images.pull(request.imageName)
    except:
        print("\nError pulling " + request.imageName, flush=True)
        #TODO: Send error message to web app
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    print(" [x] Image " + request.imageName + " pulled")


    #Create a container with gpu capabilities.
    container = dockerClient.containers.run(image=request.imageName, detach="True", device_requests=[
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
        if elapsed_time > float(request.executionTime):
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
    resultsPath = request.userId + "/" + request.requestId + "/results.tar"
    minioClient.put_object(
        MINIO_RESULTS_BUCKET, resultsPath, file_obj, length=file_obj.getbuffer().nbytes
    )

    outLogPath = request.userId + "/" + request.requestId + "/logs/out.log"
    f = open("outLog.log", "x")
    f.write(out.decode())
    f.close()
    minioClient.fput_object(
        MINIO_RESULTS_BUCKET, outLogPath, "outLog.log"
    )
    os.remove("outLog.log")

    errLogPath = request.userId + "/" + request.requestId + "/logs/err.log"
    f = open("errLog.log", "x")
    f.write(err.decode())
    f.close()
    minioClient.fput_object(
        MINIO_RESULTS_BUCKET, errLogPath, "errLog.log"
    )
    os.remove("errLog.log")

    #TODO: Send container finished to web app

    #Remove container, remove image
    container.remove()
    dockerClient.images.remove(image.id)

    print("\n=========== Request " + request.requestId + " completed ===========\n\n\n", flush=True)

    #Ack message
    ch.basic_ack(delivery_tag=method.delivery_tag)



channel.basic_qos(prefetch_count=1)
channel.basic_consume(REQUEST_QUEUE, auto_ack=False, on_message_callback=callback)
channel.start_consuming()