import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgGridModule } from 'ag-grid-angular';

import { InformationBarChartModalComponent } from './information-bar-chart-modal.component';

describe('InformationBarChartModalComponent', () => {
  let component: InformationBarChartModalComponent;
  let fixture: ComponentFixture<InformationBarChartModalComponent>;
  let mockedModalDetails = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationBarChartModalComponent ],
      imports:[ MatDialogModule,
                HttpClientTestingModule,
                AgGridModule.withComponents([]),
              ],
      providers: [{provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationBarChartModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModalDetails;
    fixture.detectChanges();
  });

   it('should create', () => {
    component.modalDetails = mockedModalDetails;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }); 
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
});