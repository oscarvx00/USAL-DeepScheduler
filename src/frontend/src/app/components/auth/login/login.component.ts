import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthDataSharingService } from 'src/app/services/auth/user-data-sharing';
import { environment } from 'src/environments/environment';
import { ErrorDialogComponent } from '../../utils/error-dialog/error-dialog.component';

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
const githubLogoURL = "https://img.icons8.com/ios-glyphs/344/github.png"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm! : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    private authService : AuthService,
    private dialog : MatDialog,
    private authDataSharingService : AuthDataSharingService,
    private router : Router,
    private domSanitizer : DomSanitizer,
    private matIconRegistry : MatIconRegistry,
    @Inject(DOCUMENT) private document : Document
  ) { 
    this.matIconRegistry.addSvgIcon(
      "logoGoogle",
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL)
    )
    this.matIconRegistry.addSvgIcon(
      "logoGithub",
      this.domSanitizer.bypassSecurityTrustResourceUrl(githubLogoURL)
    )
  }

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
    window.open(environment.apiUrl + '/auth/google',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
    let listener = window.addEventListener('message', (message) => {
      //console.log(message.data.res.access_token)
      localStorage.setItem('auth_token', message.data.res.access_token)
      //console.log("TOKEN: " + localStorage.getItem("auth_token"))
      this.authDataSharingService.isUserLoggedIn.next(true)
      this.router.navigate(['me'])
    });
  }

  onLoginGithub(){
    window.open(environment.apiUrl + '/auth/github',"mywindow","location=1,status=1,scrollbars=1, width=800,height=800");
    let listener = window.addEventListener('message', (message) => {
      //console.log(message.data.res.access_token)
      localStorage.setItem('auth_token', message.data.res.access_token)
      //console.log("TOKEN: " + localStorage.getItem("auth_token"))
      this.authDataSharingService.isUserLoggedIn.next(true)
      this.router.navigate(['me'])
    });
  }

}
