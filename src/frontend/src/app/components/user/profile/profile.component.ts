import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LegendPosition } from '@swimlane/ngx-charts';
import { User } from 'src/app/model/user';
import { TrainingService } from 'src/app/services/training/training.service';
import { UserService } from 'src/app/services/user/user.service';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog/change-password-dialog.component';
import { RemoveAccountDialogComponent } from './remove-account-dialog/remove-account-dialog/remove-account-dialog.component';

  


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  user! : User

  statsData : any = {
    "totalContainers" : 0,
    "totalHours" : 0,
    "imagesByStatus" : [
      {
        "name" : "COMPLETED",
        "value" : 1
      },
      {
        "name" : "SCHEDULED",
        "value" : 0
      },
      {
        "name" : "EXECUTING",
        "value" : 0
      },
      {
        "name" : "CANCELED",
        "value" : 0
      },
    ]
  }

  statsColors = [
      {
        "name" : "COMPLETED",
        "value" : "#99ff99"
      },
      {
        "name" : "SCHEDULED",
        "value" : "#e17eff"
      },
      {
        "name" : "EXECUTING",
        "value" : "#80ccff"
      },
      {
        "name" : "CANCELED",
        "value" : "#ff7b7b"
      },
    ]

    legendPosition = LegendPosition.Below

  constructor(
    private userService : UserService,
    private trainingService : TrainingService,
    private dialog : MatDialog
  ) { }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user : User) => {
      this.user = user
    })
    this.trainingService.getUserTrainingStats().subscribe((res : any) => {
      console.log(res)
      this.statsData = res
    })
  }

  changePassword(){
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      this.userService.changePassword(result.data.currentPassword, result.data.newPassword)
    })
  }



  removeAccount(){

    this.userService.removeAccountInit().subscribe(
      (res : any) => {
        const dialogRef = this.dialog.open(RemoveAccountDialogComponent)

        dialogRef.afterClosed().subscribe(result => {
          this.userService.removeAccountConfirm(result.data.confirmationCode)
        })
      },
      (err : any) => {
        
      }
    )

    
  }

}
