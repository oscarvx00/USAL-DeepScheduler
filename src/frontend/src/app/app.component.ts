import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'deepscheduler-frontend';

  userAuth : boolean = false

  constructor(
    private router : Router
  ){}

  loginClicked(){
    this.router.navigateByUrl('/login')
  }

  registerClicked(){
    this.router.navigateByUrl('register')
  }

}
