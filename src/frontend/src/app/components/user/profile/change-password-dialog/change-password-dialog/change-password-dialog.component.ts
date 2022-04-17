import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  changePasswordForm! : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    public dialogRef : MatDialogRef<ChangePasswordDialogComponent>
  ) { }



  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword : ['', Validators.required],
      newPassword : ['', Validators.required],
      newPassword2 : ['', Validators.required]
    })
  }

  onSubmit(){
    
    let result = {
      currentPassword : this.changePasswordForm.controls.currentPassword.value,
      newPassword : this.changePasswordForm.controls.newPassword.value,
    }

    const newPassword2 = this.changePasswordForm.controls.newPassword2.value

    if(result.newPassword != newPassword2){
      return
    }

    this.dialogRef.close({data : result})
  }

}
