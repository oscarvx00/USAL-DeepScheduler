from dataclasses import dataclass
import random
from secrets import choice
import uuid
from bson.objectid import ObjectId


def getAllRequests(database):
    requests = []
    cursor = database.trainingrequests_v2.find({})
    for req in cursor:
        requests.append(req)

    return requests

def getRequestById(database, id):
    return database.trainingrequests_v2.find_one({"_id" : ObjectId(id)})

def setRequestExecuting(database, id):
    database.trainingrequests_v2.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'EXECUTING'
        }},
        upsert=False
    )
    rawData = database.trainingrequests_v2.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def setRequestCompleted(database, id, completedComputingTime):
    database.trainingrequests_v2.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'COMPLETED',
            'completedComputingTime' : completedComputingTime
        }},
        upsert=False
    )

    rawData = database.trainingrequests_v2.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def setRequestCanceled(database, id):
    database.trainingrequests_v2.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'CANCELED',
            'completedComputingTime' : 0
        }},
        upsert=False
    )

    rawData = database.trainingrequests_v2.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def getRandomWorkerName(database):
    with open('worker_names.txt') as file:
        lines = file.readlines()
        for i in range(0, 20):
            selectedName = random.choice(lines).strip()
            databaseRes = database.workers.find_one({
                "name" : selectedName
            })
            if(databaseRes == None):
                return selectedName

    #If not name available return boring uuid
    return uuid.uuid1()


def registerWorker(database, node_id):
    #Check if exists

    worker = database.workers.find_one({"nodeId" : node_id})
    if worker != None:
        return worker['_id']
    else:
        return database.workers.insert_one({
            "nodeId" : node_id,
            "name" : getRandomWorkerName(database)
        }).inserted_id


