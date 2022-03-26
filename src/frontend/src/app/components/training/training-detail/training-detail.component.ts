import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from 'src/app/services/training/training.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  data = {
    _id : "Id",
    imageName : "Image name",
    date : "Date",
    computingTime : "Computing time",
    completedComputingTime : "Completed computong time",
    status : "COMPLETED"
  }

  constructor(
    private trainingService : TrainingService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.data._id = params['id']
      console.log(this.data._id)
    })
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

  getTrainingRequestResults(){
    this.trainingService.getTrainingRequestResults(this.data._id).subscribe((data : any)=> {
      window.open(data.url, "_blank")
    })
  }

}
