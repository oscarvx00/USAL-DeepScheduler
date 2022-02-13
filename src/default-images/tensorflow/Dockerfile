FROM nvidia/cuda:11.4.0-cudnn8-runtime-ubuntu20.04
WORKDIR /train
RUN mkdir -p /train/results
ENV RESULTS_PATH="/train/results"
RUN apt-get -y update \
    && apt-get install -y software-properties-common \
    && apt-get -y update \
    && add-apt-repository universe
RUN apt-get -y update
RUN apt-get -y install python3
RUN apt-get -y install python3-pip
RUN apt-get -y install curl
COPY requirements.txt ./
RUN pip3 install -r requirements.txt
