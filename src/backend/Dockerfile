FROM node:14.19.0-alpine3.14
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "dist/main"]