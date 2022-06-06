import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { BulkDownloadService } from '../services/bulk-download.service';
import { BulkDownloadModalComponent } from './bulk-download-modal.component';

describe('BulkDownloadModalComponent', () => {
  let component: BulkDownloadModalComponent;
  let fixture: ComponentFixture<BulkDownloadModalComponent>;
  let bulkService: BulkDownloadService;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    },
    funds: []
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }
    },
    close: () => { }
  };
  let bulkServiceServiceStub = {
    bulkDownloadFirstCall: () => {return of({})},
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
        BulkDownloadService,
        {provide:BulkDownloadService, useValue: bulkServiceServiceStub},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
        {provide: MatDialogRef, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkDownloadModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
    bulkService = TestBed.get(BulkDownloadService);
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true after click ok', () => {
    let mockResp = { 
      data: {
        fileUploadDTO: {
          downloadId : '1'
        }
      } 
    };
    spyOn(component['bulkService'],'bulkDownloadFirstCall').and.callFake(()=>{
      return of(mockResp)
    })
    component.onClickYes();
    expect(component.modalDetails.footer.YesButton).toEqual(true);
    expect(bulkService.bulkDownloadFirstCall).toHaveBeenCalled();
  });
  it('should return false after click cancel', () => {
    component.close();
    
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
  

});
