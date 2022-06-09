FROM oscarvicente/deepscheduler-pytorch-920m-cuda-base

#Copy all needed files
#COPY ./ ./

#Install the dependencies specified in requirements.txt
RUN pip3 install -r requirements.txt

#Do not modify this, instead put the launch command in the last line of entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT [ "sh", "./entrypoint.sh"]