#!/usr/bin/env python
import json
import time
import pika
from request import Request

RABBIT_HOST = "rabbitmq"
REQUEST_SCHEDULE = "request_schedule"

#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST))
channel = connection.channel()
channel.queue_declare(queue=REQUEST_SCHEDULE, durable=True)

print(' [*] Queue declared, waiting for messages')


def callback(ch, method, properties, body):

    #Decode Request data
    rawJson = json.loads(body.decode())
    request = Request.fromJson(rawJson)
    print(' [x] Received image: ', request, flush=True)

    #Image execution goes here
    time.sleep(int(request.executionTime))

    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume(REQUEST_SCHEDULE, auto_ack=False, on_message_callback=callback)
channel.start_consuming()