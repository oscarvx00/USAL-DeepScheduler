FROM python:3.8-slim-buster
WORKDIR /worker
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY worker.py ./
COPY mongoHandler.py ./
COPY worker_names.txt ./
ENTRYPOINT [ "python", "-u" , "worker.py" ]