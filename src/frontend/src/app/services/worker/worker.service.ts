import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Worker } from 'src/app/components/training/training-new/training-new.component';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor(
    private httpClient : HttpClient
  ) { }

  getWorkerQuadrants(workerId : string, startQ : number, endQ : number) : Observable<any> {
    const params = new HttpParams()
      .set('startQ', startQ)
      .set('endQ', endQ)
    return this.httpClient.get(environment.apiUrl + `/workers/${workerId}`, {params})
  }

  getAllWorkers() : Observable<Worker[]> {
    return this.httpClient.get<Worker[]>(environment.apiUrl + '/workers')
  }
}
