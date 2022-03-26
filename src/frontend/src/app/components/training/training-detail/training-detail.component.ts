import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  data = {
    imageName : "Image name",
    date : "Date",
    computingTime : "Computing time",
    completedComputingTime : "Completed computong time",
    status : "COMPLETED"
  }

  constructor() { }

  ngOnInit(): void {
  }

  getStatusClass(){
    switch(this.data.status){
      case "COMPLETED":
        return 'status-completed'
      case "SCHEDULED":
        return 'status-scheduled'
      case "EXECUTING":
        return 'status-executing'
      case 'CANCELED':
        return 'status-canceled'
      default:
        return ""
    }
  }

  getCardStatusClass(){
    switch(this.data.status){
      case "COMPLETED":
        return 'status-completed-card'
      case "SCHEDULED":
        return 'status-scheduled-card'
      case "EXECUTING":
        return 'status-executing-card'
      case 'CANCELED':
        return 'status-canceled-card'
      default:
        return ""
    }
  }

}
