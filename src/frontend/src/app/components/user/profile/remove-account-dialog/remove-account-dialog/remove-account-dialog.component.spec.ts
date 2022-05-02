import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveAccountDialogComponent } from './remove-account-dialog.component';

describe('RemoveAccountDialogComponent', () => {
  let component: RemoveAccountDialogComponent;
  let fixture: ComponentFixture<RemoveAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveAccountDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
