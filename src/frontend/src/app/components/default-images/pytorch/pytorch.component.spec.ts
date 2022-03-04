import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PytorchComponent } from './pytorch.component';

describe('PytorchComponent', () => {
  let component: PytorchComponent;
  let fixture: ComponentFixture<PytorchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PytorchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PytorchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
