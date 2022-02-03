FROM python:3.8-slim-buster
WORKDIR /tester
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
COPY wait-for-it.sh ./
COPY sender.py ./
COPY request.py ./