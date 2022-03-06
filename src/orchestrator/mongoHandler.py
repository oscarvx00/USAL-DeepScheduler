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

def setRequestCompleted(database, id):
    database.trainingrequests.update_one(
        {'_id' : ObjectId(id)},
        {'$set' : {
            'status' : 'COMPLETED'
        }},
        upsert=False
    )