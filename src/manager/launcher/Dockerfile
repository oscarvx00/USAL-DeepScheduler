FROM python:3.8-slim-buster
WORKDIR /manager
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY manager-launcher.py ./
COPY mongoHandler.py ./
ENTRYPOINT [ "python", "-u" , "manager-launcher.py" ]