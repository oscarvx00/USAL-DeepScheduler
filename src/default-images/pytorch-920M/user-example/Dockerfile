FROM oscarvicente/deepscheduler-pytorch-920m-cuda-base
COPY ./ ./
RUN rm Dockerfile
RUN pip3 install -r requirements.txt
RUN chmod +x entrypoint.sh
ENTRYPOINT [ "sh", "./entrypoint.sh"]