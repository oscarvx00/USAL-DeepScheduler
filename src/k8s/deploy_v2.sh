#!/bin/bash

#Create namespace
kubectl create namespace deepscheduler

#Run mongo
kubectl apply -f database/mongo-storage-class.yaml
kubectl apply -f database/mongo-pv.yaml
kubectl apply -f database/mongodb-pvc.yaml
kubectl apply -f database/mongodb-secrets.yaml
kubectl apply -f database/mongodb-deploy.yaml
kubectl apply -f database/mongodb-service.yaml

#Run Minio
kubectl apply -f minio/minio-storage-class.yaml
kubectl apply -f minio/minio-pv.yaml
kubectl apply -f minio/minio-pvc.yaml
kubectl apply -f minio/minio-secrets.yaml
kubectl apply -f minio/minio-deploy.yaml
kubectl apply -f minio/minio-service.yaml

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