import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';

import { BulkDownloadModalComponent } from './bulk-download-modal.component';

describe('BulkDownloadModalComponent', () => {
  let component: BulkDownloadModalComponent;
  let fixture: ComponentFixture<BulkDownloadModalComponent>;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkDownloadModalComponent ],
      imports: [RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
      ],
      providers: [
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
        {provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDownloadModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true after click ok', () => {
    spyOn(component, 'onClickYes');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
  });
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
  
});
