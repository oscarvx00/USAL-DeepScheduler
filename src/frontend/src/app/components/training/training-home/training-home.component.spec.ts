import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingHomeComponent } from './training-home.component';

describe('TrainingHomeComponent', () => {
  let component: TrainingHomeComponent;
  let fixture: ComponentFixture<TrainingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
