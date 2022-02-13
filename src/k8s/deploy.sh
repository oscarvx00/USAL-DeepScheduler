#!/bin/bash

#Run rabbitmq
kubectl apply -f rabbitmq/rabbitmq-service.yaml
kubectl apply -f rabbitmq/rabbitmq-deploy.yaml

#Run orchestrator
kubectl apply -f orchestrator/orchestrator-deploy.yaml