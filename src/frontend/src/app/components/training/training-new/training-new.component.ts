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

  MAX_QUADRANTS = 6 * 4

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

  quadrantFirstSelection = true
  quadrantsSelected : number[] = []

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
    this.initTimetableData()
    console.log(this.getQuadrant(new Date()))
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
    this.printWorkerQuadrants()
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

  private initTimetableData(){

    let time = new Date(2022, 0,1,0,0)

    const quadrants = this.generateQuadrants()


    for(let i=0; i<this.numQuadrants; i++){
      this.timetableData.push({
        time: time.toLocaleTimeString().slice(0,-3),
        d0: {
          content : ' ',
          status: 'not-available',
          quadrant: quadrants[0][i]
        },
        d1: {
          content : ' ',
          status: 'not-available',
          quadrant: quadrants[1][i]
        },
        d2: {
          content : ' ',
          status: 'not-available',
          quadrant: quadrants[2][i]
        },
        d3: {
          content : ' ',
          status: 'not-available',
          quadrant: quadrants[3][i]
        },
        d4: {
          content : ' ',
          status: 'not-available',
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

  private generateQuadrants() : number[][]{
    
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

    const diffDays = moment(date).utc().diff(epoch, 'days')

    return diffDays * this.numQuadrants + hourQuadrant
  }


  printWorkerQuadrants(){

    const quadrants = this.generateQuadrants()

    this.trainingService.getWorkerQuadrants(this.workerId, quadrants[0][0], quadrants[quadrants.length-1][quadrants[0].length-1]).subscribe(
      (res : any) => {
        if(!res.quadrants || res.quadrants.length != 96*5){
          return
        }

        for(let i=0; i<this.numQuadrants;i++){
          this.timetableData[i] = {
            ...this.timetableData[i],
            d0 : {
              ...this.timetableData[i].d0,
              status: this.calculateQuadrantStatus(res.quadrants[i])
            },
            d1 : {
              ...this.timetableData[i].d1,
              status: this.calculateQuadrantStatus(res.quadrants[i + this.numQuadrants])
            },
            d2 : {
              ...this.timetableData[i].d2,
              status: this.calculateQuadrantStatus(res.quadrants[i + this.numQuadrants*2])
            },
            d3 : {
              ...this.timetableData[i].d3,
              status: this.calculateQuadrantStatus(res.quadrants[i + this.numQuadrants*3])
            },
            d4 : {
              ...this.timetableData[i].d4,
              status: this.calculateQuadrantStatus(res.quadrants[i + this.numQuadrants*4])
            },
          }
        }
        this.timetableData = [...this.timetableData]
      },
      (err: any) => {
        console.log("ERROR")
        console.log(err)
      }
    )
  }

  private calculateQuadrantStatus(quadrant : any) : 'available' | 'not-available' | 'past-time' | 'available-selected'{
    if(this.getQuadrant(new Date()) >= quadrant.quadrant){
      return 'past-time'
    }
    
    if(quadrant.available){
      return 'available'
    } else{
      return 'not-available'
    }
  }

  getStatusClass(status : 'available' | 'not-available' | 'past-time' | 'available-selected'){
    switch(status){
      case 'available':
        return 'timetable-status-available'
      case 'not-available':
        return 'timetable-status-not-available'
      case 'past-time':
        return 'timetable-status-past-time'
      case 'available-selected':
        return 'timetable-status-available-selected'
    }
  }

  quadrantClicked(quadrant : Quadrant){

    let alertShown = false

    if(quadrant.status != 'available' && quadrant.status != 'available-selected'){
      alert('Cant select not available quadrants')
      this.quadrantFirstSelection = true
      this.unselectQuadrants()
      return
    }
    if(this.quadrantFirstSelection){
      this.unselectQuadrants()
      this.quadrantFirstSelection = false
      quadrant.status = 'available-selected'
      this.quadrantsSelected = []
      this.quadrantsSelected.push(quadrant.quadrant)
    } else{
      
      if(this.quadrantsSelected[0] < quadrant.quadrant){
        for(let i=this.quadrantsSelected[0]+1; i<=quadrant.quadrant; i++){
          this.quadrantsSelected.push(i)
        }
      } else if(this.quadrantsSelected[0] > quadrant.quadrant){
        for(let i=this.quadrantsSelected[0]-1; i>=quadrant.quadrant; i--){
          this.quadrantsSelected.push(i)
        }
      } else{
        return
      }

      if(this.quadrantsSelected.length > this.MAX_QUADRANTS){
        alert("Max time is 6 hours")
        this.quadrantFirstSelection = true
        this.unselectQuadrants()
        return
      }

      //Check if available as mark as selected
      for(let row of this.timetableData){
        Object.keys(row).forEach( (key, index) => {
          if(key != 'time'){
            if(this.quadrantsSelected.includes(row[key].quadrant)){
              if(row[key].status == 'not-available' || row[key].status == 'past-time'){
                
                if(!alertShown){
                  alert('Cant select not available quadrants')
                  alertShown = true
                  this.quadrantFirstSelection = true
                  this.unselectQuadrants()
                  
                }  
                return
              } else{
                row[key].status = 'available-selected'
              }
            }
          }
        })
      }

      this.quadrantFirstSelection = true
    }
  }

  private unselectQuadrants(){
    this.quadrantsSelected = []
    for(let row of this.timetableData){
      Object.keys(row).forEach( (key, index) => {
        if(key != 'time'){
          if(row[key].status == 'available-selected'){
            row[key].status = 'available'
          }          
        }
      })
    }
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
  status : 'available' | 'not-available' | 'past-time' | 'available-selected',
  quadrant : number
}
