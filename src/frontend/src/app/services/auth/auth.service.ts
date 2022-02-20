import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceConstants } from '../services-constants';
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

  login(username : string, password : string) {
    this.httpClient.post(ServiceConstants.API_ENDPOINT + "/auth/login", {
      username : username,
      password : password
    }).subscribe((resp : any) => {
      console.log(resp)
      localStorage.setItem('auth_token', resp.access_token)
      this.authDataSharingService.isUserLoggedIn.next(true)
      this.router.navigate(['me'])
    },
    (err : any) => {
      console.log(err)
    })
  }

  logout(){
    localStorage.removeItem('auth_token')
  }

  public get loggedIn() : boolean{
    return (localStorage.getItem('auth_token') != null)
  }

}
