import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ErrorDialogComponent } from '../../utils/error-dialog/error-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup

  errorMsg = {
    username : "Error user",
    mail : "Error",
    password : "Error",
    passwordValidate : "Error"
  }

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private authService : AuthService,
    public dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username : ['', Validators.required],
      mail : ['', Validators.required, Validators.email],
      password : ['', Validators.required],
      passwordValidate : ['', Validators.required]
    })
  }

  onSubmit(){
    //Validation
    if(this.registerForm.invalid){
      //Pensar como comprobar cada tipo de error, si hacerlo de uno en uno o pensar en algun tipo de automatismo
      this.getFormValidationErrors()
      console.log(this.registerForm.controls)
      return
    }

    const username = this.registerForm.controls.username.value
    const password = this.registerForm.controls.password.value
    const passwordValidate = this.registerForm.controls.passwordValidate.value
    const mail = this.registerForm.controls.mail.value

    this.authService.register(username, password, mail)
  }

  private getFormValidationErrors(){
    //username
    if(this.registerForm.controls.username.errors != null){
      this.errorMsg.username = this.registerForm.controls.username.errors[0]
      console.log(this.errorMsg.username)
    }
  }

}
