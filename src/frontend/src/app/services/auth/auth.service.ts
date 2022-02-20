import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  API_ENDPOINT = "http://localhost:3000"

  constructor(
    private httpClient : HttpClient,
    private router : Router
  ) { }

  login(username : string, password : string) {
    this.httpClient.post(this.API_ENDPOINT + "/auth/login", {
      username : username,
      password : password
    }).subscribe((resp : any) => {
      console.log(resp)
      //this.router.navigate(['profile'])
      localStorage.setItem('auth_token', resp.token)
    },
    (err : any) => {
      console.log(err)
    })
  }

}
