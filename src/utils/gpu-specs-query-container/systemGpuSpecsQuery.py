import json
import subprocess

def getNvidiaProps():
    props = {
        'gpu_name' : getProp('name'),
        'driver_version' : getProp('driver_version'),
        'compute_cap' : getProp('compute_cap')
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

print(json.dumps(getNvidiaProps()))