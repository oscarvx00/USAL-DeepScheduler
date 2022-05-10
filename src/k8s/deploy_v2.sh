#!/bin/bash

#Run mongo
kubectl apply -f database/mongodb-storageclass.yaml
kubectl apply -f database/mongodb-pv.yaml
kubectl apply -f database/mongodb-pvc.yaml
kubectl apply -f database/mongodb-secrets.yaml
kubectl apply -f database/mongodb-deploy.yaml
kubectl apply -f database/mongodb-service.yaml

#Run rabbitmq
kubectl apply -f rabbitmq/rabbitmq-service.yaml
kubectl apply -f rabbitmq/rabbitmq-deploy.yaml

#Run worker
kubectl apply -f worker/worker-secrets.yaml
kubectl apply -f worker/worker-deploy.yaml

#Run manager
kubectl apply -f manager/writer/manager-writer-deploy.yaml
kubectl apply -f manager/launcher/manager-launcher-deploy.yaml

#Run backend
kubectl apply -f backend/backend-secrets.yaml
kubectl apply -f backend/backend-deploy.yaml
kubectl apply -f backend/backend-service.yaml

#Run frontend
kubectl apply -f frontend/frontend-deploy.yaml
kubectl apply -f frontend/frontend-service.yaml

#Run reverse-proxy
kubectl apply -f configurable-reverse-proxy/reverse-proxy-deploy.yaml
kubectl apply -f configurable-reverse-proxy/reverse-proxy-service.yaml