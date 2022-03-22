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