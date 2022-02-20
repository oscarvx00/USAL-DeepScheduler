import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService
  ) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username : ['', Validators.required],
      password : ['', Validators.required]
    })

  }

  onSubmit(){
    if(this.loginForm.invalid){
      return
    }

    const user = new User()
    user.username = this.loginForm.controls.username.value
    user.password = this.loginForm.controls.password.value

    this.authService.login(user.username, user.password)

  }



}
