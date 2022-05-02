from bson.objectid import ObjectId


def getTrainingRequestsToLaunch(database, quadrant):
    return database.trainingrequests_v2.find({
        'quadrants.0' : quadrant,
        'status' : 'SCHEDULED'
    })
