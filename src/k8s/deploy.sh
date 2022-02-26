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

#Run orchestrator
kubectl apply -f orchestrator/orchestrator-deploy.yaml

#Run backend
kubectl apply -f backend/backend-deploy.yaml
kubectl apply -f backend/backend-service.yaml

#Run frontend
kubectl apply -f frontend/frontend-deploy.yaml
kubectl apply -f frontend/frontend-service.yaml