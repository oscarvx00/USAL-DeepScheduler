import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TrainingRequest } from 'src/app/model/trainingRequest';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(
    private httpClient : HttpClient
  ) { }

  submitTrainingRequest(imageName : string, hours : number, minutes : number) : Observable<any>{

    let timeInSeconds = (hours * 3600) + (minutes * 60)
    return this.httpClient.post(environment.apiUrl + '/training', {
      imageName : imageName,
      computingTime : timeInSeconds
    })
  }

  getUserTrainingRequests() : Observable<TrainingRequest[]>{
    return this.httpClient.get<TrainingRequest[]>(environment.apiUrl + '/training')
  }

  getUserTrainingStats() : Observable<any>{
    return this.httpClient.get(environment.apiUrl + "/training/stats")
  }
}
