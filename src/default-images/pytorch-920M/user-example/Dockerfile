FROM oscarvicente/deepscheduler-pytorch-920m-cuda-base
COPY ./ ./
RUN rm Dockerfile
RUN pip3 install -r requirements.txt
ENTRYPOINT [ "python3", "-u", "main.py", "--cuda" ]