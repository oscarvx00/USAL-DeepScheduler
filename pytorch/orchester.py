from distutils import errors
from importlib.resources import path
from io import BytesIO, StringIO
from pydoc import cli
from statistics import mode
from sys import stderr, stdout
import docker
import time
import tarfile

client = docker.from_env()

start_time = time.time()
seconds = 30

image = client.images.build(path="user-project/", tag="pytorch-user")

container = client.containers.run(image="pytorch-user:latest", detach="True", device_requests=[
    docker.types.DeviceRequest(count=-1, capabilities=[['gpu']])
])


while True:
    print(container.id)
    out = container.logs(stdout=True, stderr=False)
    print(out)
    current_time = time.time()
    elapsedTime = current_time - start_time
    if elapsedTime > seconds:
        print("Max time reached\n")
        break
    time.sleep(3)


container.stop()

out = container.logs(stdout=True, stderr=False)
print(out)


strm, stat = container.get_archive(path="/app/model.pt")

file_obj = BytesIO()
for i in strm:
    file_obj.write(i)
file_obj.seek(0)
tar  = tarfile.open(mode='r', fileobj=file_obj)
tar.extractall()
