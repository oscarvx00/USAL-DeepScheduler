FROM oscarvicente/deepscheduler-tensorflow-cuda-base
COPY ./ ./
RUN rm Dockerfile
RUN pip3 install -r requirements.txt
ENTRYPOINT [ "python3", "-u", "main.py"]