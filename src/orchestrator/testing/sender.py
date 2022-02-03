import pika
import uuid

from request import Request

RABBIT_HOST = "rabbitmq"
REQUEST_SCHEDULE = "request_schedule"

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST))
channel = connection.channel()

channel.queue_declare(queue=REQUEST_SCHEDULE, durable=True)

messages = [
    Request(str(uuid.uuid1()), "User 1", "50", "oscarvicente/tf-user-example"),
    Request(str(uuid.uuid1()),"User 2", "80", "oscarvicente/pytorch-user-example"),
    Request(str(uuid.uuid1()),"User 3", "35", "b-a-d-i-m-a-g-e"),
    Request(str(uuid.uuid1()),"User 4", "35", "oscarvicente/tf-user-example")
]

#IMPORTANT: make sure there are no white spaces

#For every message convert it to JSON and send to RabbitMQ
for m in messages:

    channel.basic_publish(
        exchange='',
        routing_key=REQUEST_SCHEDULE,
        body=m.toJson(),
        properties=pika.BasicProperties(
            delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE,
            content_type='application/json',
            content_encoding='utf8'
        ))
    print(" [x] Sent %r" % m)


connection.close()
