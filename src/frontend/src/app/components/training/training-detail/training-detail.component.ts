import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrainingService } from 'src/app/services/training/training.service';

@Component({
  selector: 'app-training-detail',
  templateUrl: './training-detail.component.html',
  styleUrls: ['./training-detail.component.scss']
})
export class TrainingDetailComponent implements OnInit {

  @ViewChild('scrollBottom') private logContainerText! : ElementRef

  data = {
    _id : "Id",
    imageName : "Image name",
    date : "Date",
    computingTime : "Computing time",
    completedComputingTime : "Completed computing time",
    status : "COMPLETED"
  }

  log = ""

  _id = ""

  constructor(
    private trainingService : TrainingService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._id = params['id']
    })
    this.trainingService.getTrainingRequest(this._id).subscribe(data => {
      this.data = data
    })
    this.trainingService.getTrainingRequestUpdate().subscribe((message : any) => {
      this.updateTrainingRequest(message.data)
    })
    this.trainingService.getTrainingRequestLogs().subscribe((message : any) => {
      
      if(message.data != undefined && message.data.requestId == this.data._id){
        this.log = message.data.log
        this.scrollToBottom()
      }
      console.log(this.log)
    })
    
  }

  ngAfterViewInit(){
    this.scrollToBottom()
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

  private updateTrainingRequest(data : any){
    if(data == undefined){
      return 
    }
    if(this.data._id == data._id){
      this.data = data
    }
  }

  private scrollToBottom(){
    try{
      this.logContainerText.nativeElement.scrollTop = this.logContainerText.nativeElement.scrollHeight
    } catch (err){
      //console.log(err)
    }
  }

  cancelTrainingRequest(){
    this.trainingService.cancelTrainingRequest(this.data._id).subscribe((data : any) => {
      alert("Canceled")
    })
  }

}
