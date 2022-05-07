import json
import re
import subprocess

def getProps():
    props = {
        'gpu_name' : getProp('name'),
        'driver_version' : getProp('driver_version'),
        'compute_cap' : getProp('compute_cap'),
        #'node_ip' : getIp()
    }
    return props


def getProp(prop):
    query = '--query-gpu='+prop
    try: 
        res = subprocess.check_output(['nvidia-smi', str(query), '--format=csv']).decode().split('\n')
        if(res[0] != prop):
            return None
        else:
            return res[1]
    except:
         return None

def getIp():
    res = subprocess.check_output(['ip', 'route', 'get', '8.8.8.8'])
    return res

print(json.dumps(getProps()))