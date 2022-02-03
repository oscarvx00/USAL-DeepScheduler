import json
from request import Request



req = Request("User", "435", "Image")

#Encoding 
req_json = req.toJson()
print(req_json)

#Decoding
rr = json.loads(req_json)
print(rr)
reqDecoded = Request.fromJson(rr)
print(reqDecoded)



