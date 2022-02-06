#!/usr/bin/env python
from asyncio import constants
from io import BytesIO
import json
from sys import stderr, stdout
import tarfile
import time
import pika
from request import Request
import docker
import os
from minio import Minio
from minio.error import S3Error

RABBIT_HOST = os.environ['RABBIT_HOST']
REQUEST_QUEUE = os.environ['REQUEST_QUEUE']

MINIO_CLIENT = "minio-oscarvx00.cloud.okteto.net"
MINIO_ACCESS = "myaccesskey"
MINIO_SECRET = "mysecretkey"

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

print(' [*] Queue declared, waiting for messages')


def callback(ch, method, properties, body):

    #Decode Request data
    rawJson = json.loads(body)
    request = Request.fromJson(rawJson)
    print(' [x] Received image: ', request, flush=True)

    user_bucket = request.userId
    #Create user bucket if not exists
    #https://docs.rightscale.com/faq/clouds/aws/What_are_valid_S3_bucket_names.html
    #Create bucket when user registers in app?
    found = minioClient.bucket_exists(bucket_name=user_bucket)
    if not found:
        minioClient.make_bucket(user_bucket)

    #Image execution control.

    #Download image
    try: 
        image = dockerClient.images.pull(request.imageName)
    except:
        print("Cant get the image", flush=True)
        #TODO: Send error message to web app
        ch.basic_ack(delivery_tag=method.delivery_tag)
        return

    print("Image " + request.imageName + " pulled")


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
            print("Max execution time reached")
            break
        elif container.status == "exited":
            print("Container exited")
            break
        #Sleep 10 seconds to prevent high cpu usage
        #print("Status: " + container.status, flush=True)
        time.sleep(10)


    container.stop()
    #Check exit code, logs, etc
    out = container.logs(stdout=True, stderr=False)
    err = container.logs(stdout=False, stderr=True)
    print("\n\n===========CONTAINER LOGS=============\n\n", flush=True)
    print(out.decode(), flush=True)
    print(err.decode(), flush=True)

    #Get results
    strm, stat = container.get_archive(path="/train/results")
    file_obj = BytesIO()
    for i in strm:
        file_obj.write(i)
    file_obj.seek(0)
    #tar = tarfile.open(mode='r', fileobj=file_obj)

    #Upload files, logs
    minioClient.put_object(
        user_bucket, "results.tar", file_obj, length=file_obj.getbuffer().nbytes
    )
    print("Resuls uploaded", flush=True)

    #Send container finished to web app

    #Remove container, remove image

    ch.basic_ack(delivery_tag=method.delivery_tag)



channel.basic_qos(prefetch_count=1)
channel.basic_consume(REQUEST_QUEUE, auto_ack=False, on_message_callback=callback)
channel.start_consuming()