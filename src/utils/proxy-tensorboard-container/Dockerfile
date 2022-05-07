FROM ubuntu/nginx
WORKDIR /script
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.go ./
COPY locations.json ./
COPY go.mod ./
COPY go.sum ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
RUN  apt-get update \
  && apt-get install -y wget \
  && rm -rf /var/lib/apt/lists/*
RUN wget -c https://dl.google.com/go/go1.14.2.linux-amd64.tar.gz -O - | tar -xz -C /usr/local
ENV PATH=$PATH:/usr/local/go/bin
ENV RABBIT_HOST="amqp://192.168.1.51:30001"
ENTRYPOINT [ "sh", "./entrypoint.sh"]