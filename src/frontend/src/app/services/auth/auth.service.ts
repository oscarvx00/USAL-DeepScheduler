import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthDataSharingService } from './user-data-sharing';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient : HttpClient,
    private router : Router,
    private authDataSharingService : AuthDataSharingService
  ) { }

  //Must return an observable for show errors??
  login(username : string, password : string) : Observable<any> {
    return this.httpClient.post(environment.apiUrl + "/auth/login", {
      username : username,
      password : password
    })
  }

  logout(){
    localStorage.removeItem('auth_token')
  }

  public get loggedIn() : boolean{
    const token = localStorage.getItem('auth_token')
    if(token != null){
      this.authDataSharingService.isUserLoggedIn.next(true)
      return true
    } else{
      this.authDataSharingService.isUserLoggedIn.next(false)
      return false
    }
  }

  //Must return an observable for show errors??
  register(username : string, password : string, mail : string) : Observable<any>{
    return this.httpClient.post(environment.apiUrl + "/auth/register", {
      username : username,
      mail : mail,
      password : password
    })
  }

}
