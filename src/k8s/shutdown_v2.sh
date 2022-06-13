#!/bin/bash

#Delete frontend
kubectl delete svc deepscheduler-frontend
kubectl delete deploy deepscheduler-frontend

#Delete backend
kubectl delete svc deepscheduler-backend
kubectl delete deploy deepscheduler-backend

#Delete worker
kubectl delete daemonset worker

#Delete managers
kubectl delete cronjob manager-launcher
kubectl delete deploy manager-writer

#Delete reverse-proxy
kubectl delete svc deepscheduler-reverse-proxy
kubectl delete deploy deepscheduler-reverse-proxy

#Delete rabbitmq
#kubectl delete statefulsets rabbitmq
#kubectl delete svc rabbitmq

#Delete mongo
#kubectl delete svc mongodb
#kubectl delete deploy mongodb

#Delete minio
#kubectl delete svc minio
#kubectl delete deploy minio

#Secrets, volumes and storage class are not deleted