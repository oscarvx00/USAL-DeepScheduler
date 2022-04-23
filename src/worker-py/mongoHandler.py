from dataclasses import dataclass
from bson.objectid import ObjectId


def getAllRequests(database):
    requests = []
    cursor = database.trainingrequests.find({})
    for req in cursor:
        requests.append(req)

    return requests

def getRequestById(database, id):
    return database.trainingrequests.find_one({"_id" : ObjectId(id)})

def setRequestExecuting(database, id):
    database.trainingrequests.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'EXECUTING'
        }},
        upsert=False
    )
    rawData = database.trainingrequests.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def setRequestCompleted(database, id, completedComputingTime):
    database.trainingrequests.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'COMPLETED',
            'completedComputingTime' : completedComputingTime
        }},
        upsert=False
    )

    rawData = database.trainingrequests.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def setRequestCanceled(database, id):
    database.trainingrequests.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'CANCELED',
            'completedComputingTime' : 0
        }},
        upsert=False
    )

    rawData = database.trainingrequests.find_one(
        {'_id' : ObjectId(id)}
    )
    rawData["_id"] = str(rawData["_id"])
    rawData["user"] = str(rawData["user"])
    return rawData


def registerWorker(database, workerName):
    #Check if exists

    worker = database.workers.find_one({"name" : workerName})
    if worker != None:
        return worker['_id']
    else:
        return database.workers.insert_one({"name" : workerName}).inserted_id