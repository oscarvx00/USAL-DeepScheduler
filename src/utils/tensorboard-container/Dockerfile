FROM python:3.8-slim-buster
WORKDIR /tensorboard
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
ENTRYPOINT [ "tensorboard", "--logdir=/train/results/" , "--host", "0.0.0.0" ]