#!/usr/bin/env python
import time
import pika

#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='rabbitmq'))
channel = connection.channel()
channel.queue_declare(queue='execution_schedule', durable=True)

print(' [*] Queue declared, waiting for messages')


def callback(ch, method, properties, body):
    print(" [x] Received %r" % body.decode())
    time.sleep(10)
    ch.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_qos(prefetch_count=1)
channel.basic_consume('execution_schedule', auto_ack=False, on_message_callback=callback)
channel.start_consuming()