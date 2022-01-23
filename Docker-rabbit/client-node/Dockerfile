FROM node:12.18.1
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY rpc_client.js ./
COPY wait-for-it.sh ./