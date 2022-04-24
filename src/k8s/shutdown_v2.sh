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

#Delete rabbitmq
#kubectl delete statefulsets rabbitmq
#kubectl delete svc rabbitmq

#Delete mongo
#kubectl delete svc mongodb
#kubectl delete deploy mongodb
#Secrets, volumes and storage class are not deleted