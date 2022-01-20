from importlib.resources import path
import json
from pydoc import cli
import docker
import time

client = docker.from_env()

image = client.images.build(path="./", tag="piptest")

container = client.containers.run(image="piptest:latest", detach="True")

print(container.id)


time.sleep(2)


file = container.get_archive(path="/dataset/data.txt")

print(file)

container.stop()


