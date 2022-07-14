import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
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
      style: '',
      YesButton: 'Yes',
      NoButton: 'No',
    },
    header: {
      style: '',
    },
    funds: [
      { id: 1, name: 'test' },
      { id: 2, name: 'test' },
    ],
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() };
    },
    close: () => {},
  };
  let bulkServiceServiceStub = {
    bulkDownloadFirstCall: () => {
      return of({});
    },
  };
  let mockedBulkDownloadResponse = {
    success: true,
    message: '',
    corelationId: '36039d95-7078-4d2b-9d57-53efeffdb081',
    data: {
      fileUploadDTO: {
        attachmentId: null,
        downloadId: '1',
        blobFileName:
          'Bulk Download - 2021-12-13 16-00-52  - c4c48fc2-29d6-452d-a752-618af4e6647c.zip',
        contentType: '.zip',
        error: null,
        fileName:
          'Bulk Download - 2021-12-13 16-00-52  - c4c48fc2-29d6-452d-a752-618af4e6647c.zip',
        success: true,
        uiuuid: 'c4c48fc2-29d6-452d-a752-618af4e6647c',
        uploadTime: 15,
        url: 'https://usedeyctfastg01.blob.core.windows.net/eyc2-bulk-package-qa34/Bulk%20Download%20-%202021-12-13%2016-00-52%20%20-%20c4c48fc2-29d6-452d-a752-618af4e6647c.zip?sv=2020-08-04&se=2021-12-14T16%3A00%3A53Z&sr=b&sp=r&sig=lKEPZ8grO78HA%2B9wOEwILesJaG6b%2BBQK4FgOWknwrAI%3D',
      },
      successCount: 1,
      failureCount: 0,
    },
    error: null,
  };
  let fakeStore = { userEmail: 'user@ey.com', pendingDownloadsBulk: '[]' };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BulkDownloadModalComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
      ],
      providers: [
        BulkDownloadService,
        { provide: BulkDownloadService, useValue: bulkServiceServiceStub },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: 'rrproduction', useValue: environment.production },
        { provide: MatDialogRef, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogStub },
      ],
    }).compileComponents();
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
  it('should return Yes after click ok and call bulkDownloadFirstCall and storePendingDownload functions', () => {
    let mockResp = {
      data: {
        fileUploadDTO: {
          downloadId: '1',
        },
      },
    };
    let fundsList: any = [];
    mockedModal.funds.forEach((element) => {
      fundsList.push({
        fundId: element.id,
        name: element.name,
      });
    });
    spyOn(window.sessionStorage, 'getItem').and.callFake((key: string) => {
      return fakeStore[key];
    });
    const userEmail = sessionStorage.getItem('userEmail');
    let data: any = {
      idempotencyKey: userEmail,
      fundDTOS: fundsList,
    };
    spyOn(component.bulkprocesed, 'emit');
    spyOn(component['dialogRef'], 'close');
    spyOn(component, 'storePendingDownload');
    spyOn(component['bulkService'], 'bulkDownloadFirstCall').and.callFake(
      () => {
        return of(mockResp);
      }
    );
    component.onClickYes();
    expect(component.modalDetails.footer.YesButton).toEqual('Yes');
    expect(bulkService.bulkDownloadFirstCall).toHaveBeenCalledWith(data);
    expect(component.storePendingDownload).toHaveBeenCalledWith('1');
    expect(sessionStorage.getItem).toHaveBeenCalledWith('userEmail');
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      button: 'Yes',
    });
    expect(component.bulkprocesed.emit).toHaveBeenCalled();
  });
  it('should return No after click close', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' });
  });
  it('storePendingDownload method should get pendingDownloads and update them', () => {
    spyOn(window.sessionStorage, 'getItem').and.callFake((key: string) => {
      return fakeStore[key];
    });
    spyOn(window.sessionStorage, 'setItem').and.callFake((key:string, value:string):string =>  {
      return fakeStore[key] = <string>value;
    });
    sessionStorage.setItem('pendingDownloadsBulk', '["1"]')
    component.storePendingDownload('2');
    expect(component.pendingDownloads).toEqual(['1','2']);
    expect(sessionStorage.getItem).toHaveBeenCalledWith('pendingDownloadsBulk');
    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      'pendingDownloadsBulk',
      JSON.stringify(['1', '2'])
    );
  });
  it('onClickYes method should call check the fundlist in the modalDetail data and call bulkdownloadFirstCall from service', () => {
    spyOn(component['bulkService'], 'bulkDownloadFirstCall').and.returnValue(
      of(mockedBulkDownloadResponse)
    );
    spyOn(component, 'storePendingDownload');
    spyOn(window.sessionStorage, 'getItem').and.callFake((key: string) => {
      return fakeStore[key];
    });
    let fundsList: any = [];
    mockedModal.funds.forEach((element) => {
      fundsList.push({
        fundId: element.id,
        name: element.name,
      });
    });
    const idFile = mockedBulkDownloadResponse.data.fileUploadDTO.downloadId;
    const userEmail = sessionStorage.getItem('userEmail');
    const mockedData: any = {
      idempotencyKey: userEmail,
      fundDTOS: fundsList,
    };
    component.onClickYes();
    expect(component['bulkService'].bulkDownloadFirstCall).toHaveBeenCalledWith(
      mockedData
    );
    expect(component.storePendingDownload).toHaveBeenCalledWith(idFile);
  });
});
