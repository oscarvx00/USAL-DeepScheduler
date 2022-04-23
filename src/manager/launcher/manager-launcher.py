from datetime import datetime
import json
import math
import os
import pika
from pymongo import MongoClient
import mongoHandler


RABBIT_HOST = os.environ['RABBIT_HOST']
MONGO_HOST = os.environ['MONGO_HOST'] 


class TrainingRequest:
    def __init__(self, _id, user, quadrants, imageName, node, date):
        self._id = _id
        self.user = user
        self.quadrants = quadrants
        self.imageName = imageName
        self.node = node
        self.date = date

    def fromJson(jsonDict):
        return TrainingRequest(jsonDict['_id'], jsonDict['user'], jsonDict['quadrants'], jsonDict['imageName'], jsonDict['node'], jsonDict['date'])
    
    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Request: [userID: " + str(self.user) + ", imageName: " + self.imageName + " ]\n"





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

channel.exchange_declare(exchange='workers_exchange', exchange_type='direct', durable=False)

def sendRequest(trainingRequest):
    channel.basic_publish(
        exchange='workers_exchange',
        routing_key=str(trainingRequest.node),
        body=json.dumps({"id" : str(trainingRequest._id)})
    )

def getCurrentQuadrant():
    #Declare init epoch
    epoch = datetime(2022,1,1,0,0)
    now = datetime.now()

    day_number = (now - epoch).days
    quadrants_per_day = 4 * 24
    hour_quadrant = now.hour * 4 + math.floor(now.minute / 15)

    return day_number * quadrants_per_day + hour_quadrant
    



trainingRequests = mongoHandler.getTrainingRequestsToLaunch(mongoDatabase, getCurrentQuadrant())

if len(list(trainingRequests)) == 0:
    print("No training requests to launch")
else:
    for tr in trainingRequests:
        print("[SENT] " + tr)
        sendRequest(TrainingRequest.fromJson(tr))


connection.close()


print("Job completed")
