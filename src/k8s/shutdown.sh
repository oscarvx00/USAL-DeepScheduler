#!/bin/bash

kubectl delete statefulsets rabbitmq
kubectl delete svc rabbitmq
kubectl delete daemonset orchestrator