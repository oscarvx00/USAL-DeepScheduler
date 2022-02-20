import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './model/user';
import { AuthDataSharingService } from './services/auth/user-data-sharing';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'deepscheduler-frontend';

  isUserLoggedIn! : boolean

  //Here que can have some user data like username or profile image

  username : string = ""

  constructor(
    private router : Router,
    private authDataSharingService : AuthDataSharingService,
    userService : UserService
  ){
    this.authDataSharingService.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value
      userService.getUserData().subscribe((user : User) => {
        this.username = user.username
      })
    })
  }

  loginClicked(){
    this.router.navigateByUrl('/login')
  }

  registerClicked(){
    this.router.navigateByUrl('register')
  }

}
