import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient : HttpClient
  ) { }

  getUserBasicProfile() : Observable<User> {
    return this.httpClient.get<User>(environment.apiUrl + "/user/profile/basic")
  }

  getUserProfile() : Observable<User> {
    return this.httpClient.get<User>(environment.apiUrl + "/user/profile")
  }

  changePassword(currentPass : string, newPass : string) {
    this.httpClient.post(environment.apiUrl + '/user/changePassword', {
      currentPass : currentPass,
      newPass : newPass
    }).subscribe()
  }

  removeAccount(currentPass : string){
    this.httpClient.post(environment.apiUrl + "/user/remove", {
      currentPass : currentPass
    }).subscribe((resp : any) => {
      //localStorage.removeItem('auth_token')
    },
    (err : any) => {

    })
  }
}
