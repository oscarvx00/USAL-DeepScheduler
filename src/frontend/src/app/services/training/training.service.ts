import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { TrainingRequestDetail } from 'src/app/components/training/training-detail/training-detail.component';
import { TrainingRequestRow } from 'src/app/components/training/training-home/training-home.component';
import { Worker } from 'src/app/components/training/training-new/training-new.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  socket = io(environment.apiSocketUrl, {
    extraHeaders: {
      Authorization : "Bearer " + localStorage.getItem('auth_token')
    }
  })

  public updateTrainingRequestMessage$ : BehaviorSubject<any> = new BehaviorSubject({})
  public trainingRequestLog$ : BehaviorSubject<any> = new BehaviorSubject({})

  constructor(
    private httpClient : HttpClient
  ) { }

  subscibeToTrainingRequestsMessages(){
    this.socket.emit('socket_init', {}); //Subcription message to init rabbitmq queue in backend
  } 

  getTrainingRequestUpdate(){
    this.socket.emit('socket_init', {}); //Subcription message to init rabbitmq queue in backend
    this.socket.on('request_status', (message) => {
        this.updateTrainingRequestMessage$.next(message)
    })

    return this.updateTrainingRequestMessage$.asObservable()
  }

  getTrainingRequestLogs(){
    this.socket.on('request_logs', (message) => {
      this.trainingRequestLog$.next(message)
    })
    return this.trainingRequestLog$.asObservable()
  }

  unsuscribeFromTrainingRequestMessages(){
    this.socket.off('request_status')
  }

  submitTrainingRequest(imageName : string, workerId : string, quadrantStart : number, quadrantEnd : number) : Observable<any>{
    return this.httpClient.post(environment.apiUrl + '/training', {
      imageName : imageName,
      workerId : workerId,
      quadrantStart : quadrantStart,
      quadrantEnd : quadrantEnd
    })
  }

  getUserTrainingRequests() : Observable<TrainingRequestRow[]>{
    return this.httpClient.get<TrainingRequestRow[]>(environment.apiUrl + '/training')
  }

  getUserTrainingStats() : Observable<any>{
    return this.httpClient.get(environment.apiUrl + "/training/stats")
  }

  getTrainingRequest(trainingRequestId : string) : Observable<TrainingRequestDetail>{
    return this.httpClient.get<TrainingRequestDetail>(environment.apiUrl + `/training/${trainingRequestId}`)
  }

  getTrainingRequestResults(trainingRequestId : string) : Observable<any>{
    return this.httpClient.get(environment.apiUrl + `/training/results/${trainingRequestId}`)
  }

  cancelTrainingRequest(trainingRequestId : string) : Observable<any>{
    return this.httpClient.get(environment.apiUrl + `/training/cancel/${trainingRequestId}`)
  }

  

  
}
