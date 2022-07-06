import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';
import { of } from 'rxjs';

import { InformationBarChartModalComponent } from './information-bar-chart-modal.component';

describe('InformationBarChartModalComponent', () => {
  let component: InformationBarChartModalComponent;
  let fixture: ComponentFixture<InformationBarChartModalComponent>;
  let mockedModal = {
    footer: {
      style: '',
      YesButton: 'Yes',
      NoButton: 'No',
    },
    header: {
      style: '',
    },
    funds: [],
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() };
    },
    close: () => {},
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationBarChartModalComponent],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        AgGridModule.withComponents([]),
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: matDialogStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationBarChartModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should return false after click cancel', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' })
  });
});
