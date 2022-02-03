import json
from request import Request
import uuid



req = Request(str(uuid.uuid1()), "User 1", "40", "oscarvicente/tf-user-example ")

#Encoding 
req_json = req.toJson()
print(req_json)

#Decoding 
rr = json.loads(req_json)
print(rr)
reqDecoded = Request.fromJson(rr)
print(reqDecoded)



