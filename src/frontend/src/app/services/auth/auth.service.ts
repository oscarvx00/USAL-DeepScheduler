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

  //Must return an observable for show errors??
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
    const token = localStorage.getItem('auth_token')
    if(token != null && !this.isTokenExpired(token)){
      this.authDataSharingService.isUserLoggedIn.next(true)
      return true
    } else{
      this.authDataSharingService.isUserLoggedIn.next(false)
      return false
    }
  }

  private isTokenExpired(token : string) : boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  //Must return an observable for show errors??
  register(username : string, password : string, mail : string){
    this.httpClient.post(ServiceConstants.API_ENDPOINT + "/auth/register", {
      username : username,
      mail : mail,
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

}
