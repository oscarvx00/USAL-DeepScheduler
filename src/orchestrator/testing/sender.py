import pika
import sys
import time

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()

channel.queue_declare(queue='execution_schedule', durable=True)

messages = ["Hello", "testing", "message", "queue"]


for m in messages:

    channel.basic_publish(
        exchange='',
        routing_key='execution_schedule',
        body=m,
        properties=pika.BasicProperties(
            delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
        ))
    print(" [x] Sent %r" % m)


connection.close()
