from bson.objectid import ObjectId


def checkTrainingRequestQuadrants(database, request):

    for q in request.quadrants:
        res = database.trainingrequests_v2.find_one(
            {
                'quadrants': q,
                'node': ObjectId(request.node)
            }
        )
        if res:
            return False

    return True

def checkNodeExists(database, nodeId):
    res = database.nodes.find_one({
        '_id' : ObjectId(nodeId)
    })

    return res != None



def insertTrainingRequest(database, request):
    database.trainingrequests_v2.insert_one({
        'imageName' : request.imageName,
        'quadrants' : request.quadrants,
        'user' : ObjectId(request.user),
        'node' : ObjectId(request.node),
        'date' : request.date,
        'status' : 'SCHEDULED'
    })

