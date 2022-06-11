import docker

TENSORBOARD_IMAGE = 'oscarvicente/tensorboard-container'

dockerClient = docker.from_env()

tensorboard_image = dockerClient.images.pull(TENSORBOARD_IMAGE)
tensorboard_volume = dockerClient.volumes.create()
tensorboard_container = dockerClient.containers.run(image=TENSORBOARD_IMAGE, detach=True,
volumes=[tensorboard_volume.id+':/train/results'], ports={'6006/tcp' : ('0.0.0.0', 50000)})
container = dockerClient.containers.run(image='oscarvicente/pytorch-920m-user-example', detach="True", device_requests=[
        docker.types.DeviceRequest(count=-1, capabilities=[['gpu']])],
        volumes=[tensorboard_volume.id+':/train/results']
    )

