FROM oscarvicente/deepscheduler-pytorch-cuda-base
COPY ./ ./
RUN rm Dockerfile
RUN pip3 install -r requirements.txt
ENTRYPOINT [ "python3", "-u", "main.py", "--cuda" ]