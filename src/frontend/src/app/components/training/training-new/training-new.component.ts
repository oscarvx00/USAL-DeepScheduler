import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/services/training/training.service';

@Component({
  selector: 'app-training-new',
  templateUrl: './training-new.component.html',
  styleUrls: ['./training-new.component.scss']
})
export class TrainingNewComponent implements OnInit {

  currentStep = 0

  hours = [0,1,2,3,4,5,6]
  minutes = [0,15,30,45]

  imageNameForm! : FormGroup
  computingTimeForm! : FormGroup

  @ViewChild('inputComputingTime') cardComputingTime! : ElementRef
  @ViewChild('continueButton') continueButton! : ElementRef

  constructor(
    private formBuilder : FormBuilder,
    private trainingService : TrainingService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.imageNameForm = this.formBuilder.group({
      imageName : ['', Validators.required]
    })
    this.computingTimeForm = this.formBuilder.group({
      hours : ['', Validators.required],
      minutes : ['', Validators.required]
    })
  }

  continueClicked(){
    switch (this.currentStep){
      case 0:
        this.cardComputingTime.nativeElement.classList.remove('view-gone')
        break;
      case 1:
        this.submitImage()
        break;
    }
    if(this.currentStep < 1){
      this.currentStep++
    }
    
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

}
