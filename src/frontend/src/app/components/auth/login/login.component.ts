import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthDataSharingService } from 'src/app/services/auth/user-data-sharing';
import { ErrorDialogComponent } from '../../utils/error-dialog/error-dialog.component';
import { LoginExternal } from '../login-external';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup
  loginExternal = new LoginExternal(this.authDataSharingService, this.router)

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private dialog : MatDialog,
    private authDataSharingService : AuthDataSharingService,
    private router : Router,
  ) {  }

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

    this.authService.login(user.username, user.password).subscribe((resp : any) => {
      localStorage.setItem('auth_token', resp.access_token)
      this.authDataSharingService.isUserLoggedIn.next(true)
      this.router.navigate(['me'])
    },
    (err : any) => {
      this.dialog.open(ErrorDialogComponent, {
        data: err.error.message
      })
    })

  }

  onLoginGoogle(){
    this.loginExternal.loginWithGoogle()
  }

  onLoginGithub(){
    this.loginExternal.loginWithGithub()
  }
}
