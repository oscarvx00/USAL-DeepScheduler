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
    {_id: "uuid1", imageName: "image 1", status: "pending", computingTime: "2 h"/*, date: "01/01/2000"*/},
    {_id: "uuid1", imageName: "image 2", status: "pending", computingTime: "2 h"/*, date: "01/01/2000"*/}
  
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
  }

  createClicked(){
    this.router.navigateByUrl('training/new')
  }

}
