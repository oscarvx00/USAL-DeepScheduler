import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TrainingRequest } from 'src/app/model/trainingRequest';

const userImages: TrainingRequest[] = [
  {uuid: "uuid1", image: "image 1", state: "pending", executingTime: "2 h", date: "01/01/2000"},
  {uuid: "uuid1", image: "image 1", state: "pending", executingTime: "2 h", date: "01/01/2000"}

]


@Component({
  selector: 'app-training-home',
  templateUrl: './training-home.component.html',
  styleUrls: ['./training-home.component.scss']
})
export class TrainingHomeComponent implements OnInit {

  displayedColumns: string[] = ['image', 'state'];
  dataSource: TrainingRequest[] = [
    {uuid: "uuid1", image: "image 1", state: "pending", executingTime: "2 h", date: "01/01/2000"},
    {uuid: "uuid1", image: "image 1", state: "pending", executingTime: "2 h", date: "01/01/2000"}
  
  ]

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {

  }

  createClicked(){
    this.router.navigateByUrl('training/new')
  }

}
