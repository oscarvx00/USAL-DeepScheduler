#!/bin/bash

#Delete frontend
kubectl delete svc -n deepscheduler deepscheduler-frontend
kubectl delete deploy -n deepscheduler deepscheduler-frontend

#Delete backend
kubectl delete svc -n deepscheduler deepscheduler-backend
kubectl delete deploy -n deepscheduler deepscheduler-backend

#Delete worker
kubectl delete daemonset -n deepscheduler worker

#Delete managers
kubectl delete cronjob -n deepscheduler manager-launcher
kubectl delete deploy -n deepscheduler manager-writer

#Delete reverse-proxy
kubectl delete svc -n deepscheduler deepscheduler-reverse-proxy
kubectl delete deploy -n deepscheduler deepscheduler-reverse-proxy

#Delete rabbitmq
#kubectl delete statefulsets -n deepscheduler rabbitmq
#kubectl delete svc -n deepscheduler rabbitmq

#Delete mongo
#kubectl delete svc -n deepscheduler mongodb
#kubectl delete deploy -n deepscheduler mongodb

#Delete minio
#kubectl delete svc -n deepscheduler minio
#kubectl delete deploy -n deepscheduler minio

#Secrets, volumes and storage class are not deleted