import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/user';
import { AuthService } from './services/auth/auth.service';
import { AuthDataSharingService } from './services/auth/user-data-sharing';
import { UserService } from './services/user/user.service';
import {  ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'deepscheduler-frontend';

  isUserLoggedIn! : boolean

  //Here que can have some user data like username or profile image

  username : string = ""

  //@ViewChild('navdrop', undefined) navdrop! : ElementRef

  showProfile : boolean = false

  constructor(
    private router : Router,
    private authDataSharingService : AuthDataSharingService,
    private userService : UserService,
    private authService : AuthService,
  ){
    this.authDataSharingService.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value
      if(value){
        this.getUserToolbarInfo()
      }     
    })
  }

  ngOnInit(){
    if(this.authService.loggedIn){
      this.isUserLoggedIn = true
      this.getUserToolbarInfo()
    }
  }

  getUserToolbarInfo(){
    this.userService.getUserBasicProfile().subscribe((user : User) => {
      this.username = user.username
    })
  }

  loginClicked(){
    this.router.navigateByUrl('login')
  }

  registerClicked(){
    this.router.navigateByUrl('register')
  }

  profileClicked(){
    this.showProfile = false
    this.router.navigateByUrl('me')
  }

  logoutClicked(){
    this.showProfile = false
    localStorage.removeItem('auth_token')
    this.authDataSharingService.isUserLoggedIn.next(false)
    this.router.navigate([''])
  }

  trainingClicked(){
    this.showProfile = false
    this.router.navigate(['training'])
  }


}
