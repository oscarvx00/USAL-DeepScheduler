import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TrainingRequest } from 'src/app/model/trainingRequest';
import { TrainingService } from 'src/app/services/training/training.service';


@Component({
  selector: 'app-training-home',
  templateUrl: './training-home.component.html',
  styleUrls: ['./training-home.component.scss']
})
export class TrainingHomeComponent implements OnInit {

  displayedColumns: string[] = ['image', 'status'];
  dataSource: TrainingRequest[] = [
    /*{_id: "uuid1", imageName: "image 1", status: "COMPLETED", computingTime: "2 h"},
    {_id: "uuid1", imageName: "image 2", status: "SCHEDULED", computingTime: "2 h"},
    {_id: "uuid1", imageName: "image 3", status: "EXECUTING", computingTime: "2 h"},
    {_id: "uuid1", imageName: "image 4", status: "CANCELED", computingTime: "2 h"}*/
  
  ]

  constructor(
    private router : Router,
    private trainingService : TrainingService
  ) { }

  ngOnInit(): void {
    this.trainingService.getUserTrainingRequests().subscribe((data : TrainingRequest[]) => {
      //console.log(data)
      this.dataSource = data
    },
    (err : any) => {
      console.log(err)
    })

    this.trainingService.getTrainingRequestUpdate().subscribe((message : any) => {
      this.updateTrainingRequest(message.data)
    })
  }

  createClicked(){
    this.router.navigateByUrl('training/new')
  }

  test(item : any){
    console.log(item)
  }

  getStatusClass(status : string){
    switch(status){
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

  private updateTrainingRequest(tr : TrainingRequest){
    const index = this.dataSource.findIndex(x => x._id == tr._id)
    this.dataSource[index] = tr
    this.dataSource = [...this.dataSource]
  }

}
