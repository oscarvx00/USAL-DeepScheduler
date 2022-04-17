import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-account-dialog',
  templateUrl: './remove-account-dialog.component.html',
  styleUrls: ['./remove-account-dialog.component.scss']
})
export class RemoveAccountDialogComponent implements OnInit {

  removeAccountForm! : FormGroup

  constructor(
    private formBuilder : FormBuilder,
    public dialogRef : MatDialogRef<RemoveAccountDialogComponent>
  ) { }



  ngOnInit(): void {
    this.removeAccountForm = this.formBuilder.group({
      currentPassword : ['', Validators.required],
    })
  }

  onSubmit(){

    if(this.removeAccountForm.invalid){
      return
    }

    let data = {
      currentPassword : this.removeAccountForm.controls.currentPassword.value
    }
    

    this.dialogRef.close({data : data})
  }

}
