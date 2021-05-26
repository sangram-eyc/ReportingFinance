import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ErrorAlertComponent } from './error-alert.component';

describe('ErrorAlertComponent', () => {
  let component: ErrorAlertComponent;
  let fixture: ComponentFixture<ErrorAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorAlertComponent ],
      imports: [MatDialogModule, HttpClientTestingModule ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MatDialog, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', async(() => {
  //   expect(component).toBeTruthy();
  // }));
});
