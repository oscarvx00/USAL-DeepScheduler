import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { ServiceConstants } from '../services-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient : HttpClient
  ) { }

  getUserData() : Observable<User> {
    return this.httpClient.get<User>(ServiceConstants.API_ENDPOINT + "/user")
  }
}
