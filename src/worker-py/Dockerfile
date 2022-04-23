FROM python:3.8-slim-buster
WORKDIR /orch
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY orchestrator.py ./
COPY mongoHandler.py ./
ENTRYPOINT [ "python", "-u" , "orchestrator.py" ]