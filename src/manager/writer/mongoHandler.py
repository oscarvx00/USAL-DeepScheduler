from bson.objectid import ObjectId


def checkTrainingRequestQuadrants(database, request):

    for q in request.quadrants:
        res = database.trainingrequests_v2.find_one(
            {
                'quadrants': q,
                'node': ObjectId(request.worker)
            }
        )
        if res:
            return False

    return True

def checkWorkerExists(database, workerId):
    res = database.workers.find_one({
        '_id' : ObjectId(workerId)
    })

    return res != None



def insertTrainingRequest(database, request):
    database.trainingrequests_v2.insert_one({
        'imageName' : request.imageName,
        'quadrants' : request.quadrants,
        'user' : ObjectId(request.user),
        'worker' : ObjectId(request.worker),
        'date' : request.date,
        'status' : 'SCHEDULED'
    })

