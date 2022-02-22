import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private authService : AuthService
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
      //Show errors
      return
    }

    const username = this.registerForm.controls.username.value
    const password = this.registerForm.controls.password.value
    const passwordValidate = this.registerForm.controls.passwordValidate.value
    const mail = this.registerForm.controls.mail.value

    this.authService.register(username, password, mail)
  }

}
