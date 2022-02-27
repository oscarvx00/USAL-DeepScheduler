import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AuthDataSharingService } from 'src/app/services/auth/user-data-sharing';
import { ErrorDialogComponent } from '../../utils/error-dialog/error-dialog.component';

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
    private authService : AuthService,
    public dialog : MatDialog,
    private authDataSharingService : AuthDataSharingService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username : ['', Validators.required],
      mail : ['', [Validators.required, Validators.email]],
      password : ['', Validators.required]
    })
  }

  onSubmit(){
    //Validation
    if(this.registerForm.invalid){
      //this.getFormValidationErrors()
      return
    }

    const username = this.registerForm.controls.username.value
    const password = this.registerForm.controls.password.value
    const mail = this.registerForm.controls.mail.value

    this.authService.register(username, password, mail).subscribe((resp : any) => {
      alert("Registration completed. Check your email")
      this.router.navigate([''])
    },
    (err : any) => {
      //We can do some error msg formatting here
      this.dialog.open(ErrorDialogComponent, {
        data: err.error.message
      })
    })
  }
}
