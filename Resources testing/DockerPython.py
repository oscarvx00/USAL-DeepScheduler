from importlib.resources import path
from io import BytesIO
import json
from pydoc import cli
import tarfile
import docker
import time

client = docker.from_env()

image = client.images.build(path="./", tag="piptest")

container = client.containers.run(image="piptest:latest", detach="True")

print(container.id)


time.sleep(2)


stream, stat = container.get_archive(path="/dataset/data.txt")
file_obj = BytesIO()
for i in stream:
    file_obj.write(i)
file_obj.seek(0)
tar = tarfile.open(mode='r', fileobj=file_obj)
text = tar.extractfile('data.txt')
q = text.read()
print(q)

container.stop()
