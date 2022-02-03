import pika

from request import Request

RABBIT_HOST = "rabbitmq"
REQUEST_SCHEDULE = "request_schedule"

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST))
channel = connection.channel()

channel.queue_declare(queue=REQUEST_SCHEDULE, durable=True)

messages = [
    Request("User 1", "5", "Image 1"),
    Request("User 2", "5", "Image 2"),
    Request("User 3", "10", "Image 3")
]

#For every message convert it to JSON and send to RabbitMQ
for m in messages:

    channel.basic_publish(
        exchange='',
        routing_key=REQUEST_SCHEDULE,
        body=m.toJson(),
        properties=pika.BasicProperties(
            delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE
        ))
    print(" [x] Sent %r" % m)


connection.close()
