#!/usr/bin/env python
from asyncio import constants
import json
from sys import stderr, stdout
import time
import pika
from request import Request
import docker

RABBIT_HOST = "rabbitmq"
REQUEST_SCHEDULE = "request_schedule"

#Get docker socket client
dockerClient = docker.from_env()

#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST))
channel = connection.channel()
channel.queue_declare(queue=REQUEST_SCHEDULE, durable=True)

print(' [*] Queue declared, waiting for messages')


def callback(ch, method, properties, body):

    #Decode Request data
    #print(body)
    rawJson = json.loads(body)
    request = Request.fromJson(rawJson)
    print(' [x] Received image: ', request, flush=True)

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


    #Get results, upload files, upload logs
    #Send container finished to web app

    #Remove container, remove image

    ch.basic_ack(delivery_tag=method.delivery_tag)



channel.basic_qos(prefetch_count=1)
channel.basic_consume(REQUEST_SCHEDULE, auto_ack=False, on_message_callback=callback)
channel.start_consuming()