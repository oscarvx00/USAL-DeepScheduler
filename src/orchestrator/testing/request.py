import json

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