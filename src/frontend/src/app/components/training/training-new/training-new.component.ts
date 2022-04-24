import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/services/training/training.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-training-new',
  templateUrl: './training-new.component.html',
  styleUrls: ['./training-new.component.scss']
})
export class TrainingNewComponent implements OnInit {

  currentStep = 0

  numDays = 5
  numQuadrants = 4 * 24

  hours = [0,1,2,3,4,5,6]
  minutes = [0,15,30,45]

  imageNameForm! : FormGroup
  computingTimeForm! : FormGroup

  timetableData : TimetableRow[] = new Array<TimetableRow>()
  displayedColumns : string[] = ['time', 'd0', 'd1', 'd2', 'd3', 'd4']
  daysColumHeader : string[] = []

  workerId = "62641d03d84966a982b0b1e1"

  @ViewChild('inputComputingTime') cardComputingTime! : ElementRef
  @ViewChild('continueButton') continueButton! : ElementRef

  constructor(
    private formBuilder : FormBuilder,
    private trainingService : TrainingService,
    private router : Router
  ) {
    
   }

  ngOnInit(): void {
    this.imageNameForm = this.formBuilder.group({
      imageName : ['', Validators.required]
    })
    this.computingTimeForm = this.formBuilder.group({
      hours : ['', Validators.required],
      minutes : ['', Validators.required]
    })
    this.generateTimetableData()
    this.test()
  }

  continueClicked(){
    /*switch (this.currentStep){
      case 0:
        this.cardComputingTime.nativeElement.classList.remove('view-gone')
        break;
      case 1:
        this.submitImage()
        break;
    }
    if(this.currentStep < 1){
      this.currentStep++
    }*/

    this.generateQuadrants()
    
  }

  submitImage(){
    console.log("Submit")
    if(this.imageNameForm.invalid){
      //Show error
      return
    }
    if(this.computingTimeForm.invalid){
      //Show error
      return
    }

    let imageName = this.imageNameForm.controls.imageName.value
    let hours = this.computingTimeForm.controls.hours.value
    let minutes = this.computingTimeForm.controls.minutes.value

    this.trainingService.submitTrainingRequest(imageName, Number(hours), Number(minutes))
      .subscribe((res : any) => {
        this.router.navigateByUrl('training')
      },
      (err : any) =>{

      })
  }

  generateTimetableData(){

    let time = new Date(2022, 0,1,0,0)

    const quadrants = this.generateQuadrants()

    

    for(let i=0; i<this.numQuadrants; i++){
      this.timetableData.push({
        time: time.toLocaleTimeString().slice(0,-3),
        d0: {
          content : ' ',
          status: 'free',
          quadrant: quadrants[0][i]
        },
        d1: {
          content : ' ',
          status: 'free',
          quadrant: quadrants[1][i]
        },
        d2: {
          content : ' ',
          status: 'free',
          quadrant: quadrants[2][i]
        },
        d3: {
          content : ' ',
          status: 'free',
          quadrant: quadrants[3][i]
        },
        d4: {
          content : ' ',
          status: 'free',
          quadrant: quadrants[4][i]
        },
      })
      time = new Date(time.getTime() + 15*60000)
    }

    let date = new Date()
    for(let i=0; i<this.numDays; i++){
      this.daysColumHeader.push(date.toLocaleDateString())
      date.setDate(date.getDate() + 1)
    }
  }

  generateQuadrants() : number[][]{
    
    const now = new Date()
    let iteratorDate = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0))

    let quadrants : number[][] = new Array<Array<number>>()
    for(let i=0; i<this.numDays; i++){
      quadrants.push(new Array<number>())
    }

    for(let i=0; i<this.numDays; i++){
      for(let j=0; j<this.numQuadrants; j++){
        quadrants[i].push(this.getQuadrant(iteratorDate.toDate()))
        iteratorDate.add(15, 'minutes')
      }
    }
    
    return quadrants

  }

  private getQuadrant(date : Date) : number{
    const epoch = moment.utc([2022,0,1,0,0])
    const hourQuadrant = date.getUTCHours() * 4 + Math.floor(date.getUTCMinutes() / 15)

    console.log(date.getUTCHours())

    const diffDays = moment(date).utc().diff(epoch, 'days')
    console.log(diffDays)

    return diffDays * this.numQuadrants + hourQuadrant
  }

  test(){
    const quadrants = this.generateQuadrants()

    this.trainingService.getWorkerQuadrants(this.workerId, quadrants[0][0], quadrants[quadrants.length-1][quadrants[0].length-1]).subscribe(
      (res : any) => {
        console.log(res)
      },
      (err: any) => {
        console.log("ERROR")
        console.log(err)
      }
    )
  }

}

export interface TimetableRow{
  time : string
  d0 : Quadrant
  d1 : Quadrant
  d2 : Quadrant
  d3 : Quadrant
  d4 : Quadrant
}

export interface Quadrant{
  content : string,
  status : 'free' | 'not-available' | 'past time',
  quadrant : number
}
