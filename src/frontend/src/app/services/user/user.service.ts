import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';
import { AuthDataSharingService } from '../auth/user-data-sharing';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient : HttpClient,
    private router : Router,
    private authDataSharingService : AuthDataSharingService
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

  removeAccountInit() : Observable<any>{
    return this.httpClient.get(environment.apiUrl + "/user/remove/init")
  }

  removeAccountConfirm(confirmationCode : string){
    this.httpClient.post(environment.apiUrl + "/user/remove/confirm", {
      confirmationCode : confirmationCode
    }).subscribe((resp : any) => {
      //console.log(resp + "HOLA")
      localStorage.removeItem('auth_token')
      this.authDataSharingService.isUserLoggedIn.next(false)
      this.router.navigate([''])
    },
    (err : any) => {
      //console.log(err)
    })
  }
}
