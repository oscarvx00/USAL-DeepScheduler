import pika
import uuid
import json
import os

RABBIT_HOST =  "localhost" #os.environ['RABBIT_HOST']
REQUEST_QUEUE = "request_queue" #os.environ['REQUEST_QUEUE']

class Request:
    def __init__(self, requestId, userId, executionTime, imageName):
        self.requestId = requestId
        self.userId = userId
        self.executionTime = executionTime
        self.imageName = imageName

    def fromJson(jsonDict):
        return Request(jsonDict['requestId'],jsonDict['userId'], jsonDict['executionTime'], jsonDict['imageName'])
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Request: [requestId: " + self.requestId + " userID: " + self.userId + ", executionTime: " + self.executionTime + ", imageName: " + self.imageName + " ]\n"



connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST, port=30001))
channel = connection.channel()

channel.queue_declare(queue=REQUEST_QUEUE, durable=True)

messages = [
    Request(str(uuid.uuid4()), "user-1", "50", "oscarvicente/tf-user-example"),
    Request(str(uuid.uuid4()),"user-2", "80", "oscarvicente/pytorch-920m-user-example"),
    Request(str(uuid.uuid4()),"user-3", "35", "b-a-d-i-m-a-g-e"),
    #Request(str(uuid.uuid4()),"user-4", "35", "oscarvicente/tf-user-example")
]

#IMPORTANT: make sure there are no white spaces

#For every message convert it to JSON and send to RabbitMQ
for m in messages:

    channel.basic_publish(
        exchange='',
        routing_key=REQUEST_QUEUE,
        body=m.toJson(),
        properties=pika.BasicProperties(
            delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE,
            content_type='application/json',
            content_encoding='utf8'
        ))
    print(" [x] Sent %r" % m)


connection.close()
