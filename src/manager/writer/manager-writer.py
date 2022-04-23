import json
import os
import pika
from pymongo import MongoClient
import mongoHandler


RABBIT_HOST = os.environ['RABBIT_HOST']
MONGO_HOST = os.environ['MONGO_HOST'] 

class TrainingRequest:
    def __init__(self,  user, quadrants, imageName, node, date):
        self.user = user
        self.quadrants = quadrants
        self.imageName = imageName
        self.node = node
        self.date = date

    def fromJson(jsonDict):
        return TrainingRequest(jsonDict['user'], jsonDict['quadrants'], jsonDict['imageName'], jsonDict['nodeId'], jsonDict['date'])
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Request: [userID: " + str(self.user) + ", quadrants: " + str(self.quadrants) + ", imageName: " + self.imageName + ", node: " + self.node + " ]\n"


#Create MongoDB client
mongoClient = MongoClient(host='localhost', port=30002)
#mongoClient = MongoClient(host=MONGO_HOST)
mongoDatabase = mongoClient.ds


#Create connection to RabbitMQ container based on its service name
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0, port=30001))
#connection = pika.BlockingConnection(
#    pika.ConnectionParameters(host=RABBIT_HOST, heartbeat=0))
channel = connection.channel()


#Declare manager queue
channel.exchange_declare(exchange='manager_exchange', exchange_type='fanout', durable=False)
channel.queue_declare(queue='manager_queue', durable=False)
channel.queue_bind(exchange='manager_exchange', queue='manager_queue')


def callback(ch, method, properties, body):
    print(body.decode('utf-8'))
    trainingRequest = TrainingRequest.fromJsonV2(json.loads(body.decode('utf-8')))
    print(trainingRequest)

    if not mongoHandler.checkNodeExists(mongoDatabase, trainingRequest.node):

        response = json.dumps({
            'result' : 'error',
            'reason' : 'node not exists'
        })

        channel.basic_publish(exchange='',
                            routing_key=properties.reply_to,
                            properties=pika.BasicProperties(correlation_id=properties.correlation_id),
                            body=response)
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return

    if not mongoHandler.checkTrainingRequestQuadrants(mongoDatabase, trainingRequest):
        response = json.dumps({
            'result' : 'error',
            'reason' : 'node not available at required quadrants'
        })

        channel.basic_publish(exchange='',
                            routing_key=properties.reply_to,
                            properties=pika.BasicProperties(correlation_id=properties.correlation_id),
                            body=response)
        channel.basic_ack(delivery_tag=method.delivery_tag)
        return
    

    
    mongoHandler.insertTrainingRequest(mongoDatabase, trainingRequest)
    response = json.dumps({
        'result' : 'OK'
    })
    

    channel.basic_publish(exchange='',
                            routing_key=properties.reply_to,
                            properties=pika.BasicProperties(correlation_id=properties.correlation_id),
                            body=response)
    
    channel.basic_ack(delivery_tag=method.delivery_tag)
    
channel.basic_qos(prefetch_count=1)
channel.basic_consume(queue='manager_queue', on_message_callback=callback)
channel.start_consuming()