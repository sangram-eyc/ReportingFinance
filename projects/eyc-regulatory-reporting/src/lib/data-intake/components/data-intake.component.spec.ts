import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { DataIntakeService } from '../services/data-intake.service';

import { DataIntakeComponent } from './data-intake.component';

describe('DataIntakeComponent', () => {
  let component: DataIntakeComponent;
  let fixture: ComponentFixture<DataIntakeComponent>;

  let dataIntakeServiceStub = {
    getExceptionReports: () => { },
    getfilesList: () => { },
    exportIntakeData: () => { },
    markDatantakeComplete: () => { },
    approveExceptionReports: () => { },
    getDatasetsrecords: () => { },
    getBDFilesList:()=>{
      return of({})
    }
  }
  let regulatoryReportingFilingServiceStub = {
    checkFilingCompletedStatus: () => { },
    invokeFilingDetails: () => { }
  }
  let eycRrSettingsServiceStub = {
    regReportingFiling: {
      di_exception_reports: '/di_exception_reports/',
      datasets_list: '/datasets_list/',
      bd_files_list: '/bd_files_list/'
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataIntakeComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: DataIntakeService, useValue: dataIntakeServiceStub },
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receiveFilingDetails method should set filingDetails and call getFilingEntities method', () => {
    let mockEventData = {
      data: []
    }
    spyOn(sessionStorage, 'getItem').and.returnValue('data');
    spyOn(component, 'getExceptionReports');
    component.receiveFilingDetails(mockEventData);
    expect(component.filingDetails).toEqual({ data: [] });
    expect(component.getExceptionReports).toHaveBeenCalled();
  });

  it('getExceptionReports method should call api and get exception reports when resetdata is true', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }

    const mockResp = {
      data: [{
        approved: false,
        comments: 2,
        exceptionId: 18,
        exceptionReportName: "HK QS - Highest Ongoing Charge is blank and NAV < $5M",
        exceptionReportType: "Answer Check",
        mytask: false,
        resolved: "0",
        reviewLevel: "L2 Review",
        unresolved: 14,
        updateBy: "Akshay.Raskar1@ey.com",
        updateDate: "2022-06-01 05:35:02.585"
      }],
      totalRecords: 1
    }
    spyOn(component['service'], 'getExceptionReports').and.callFake(() => {
      return of(mockResp)
    });
    component.getExceptionReports(true);
    expect(component.exceptionData).toEqual(mockResp['data']);
  });

  it('getFiles method should return files', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }

    let mockResp = {
      data: [
        { reg_reporting: 'Form PF' }
      ]
    }
    spyOn(component['service'], 'getfilesList').and.callFake(() => {
      return of(mockResp)
    });
    component.getFiles()
  })

  it('getIntakeDetails method should enable tabs', () => {
    component.getIntakeDetails(true);
    expect(component.enableTabs).toEqual(true)
  })

  it('exceptionReportRowsSelected method should set exception Report Rows', () => {
    let mockData = [
      {
        id: 123,
        exceptionReportName: 'Form PF'
      }
    ]
    component.exceptionReportRowsSelected(mockData);
    expect(component.exceptionReportRows).toEqual(mockData)
  })

  it('checkFilingCompletedStatus method should return completed status', () => {
    component.filingDetails = {
      filingName: 'form PF'
    }
    spyOn(component['filingService'], 'checkFilingCompletedStatus').and.returnValue(true);
    let res = component.checkFilingCompletedStatus();
    expect(res).toEqual(true);
  })

  it('handleGridReady method should set gridApi', () => {
    component.handleGridReady({ api: '/api' });
    expect(component.gridApi).toEqual('/api')
  })

  it('handleExceptionGridReady method should set gridApi', () => {
    component.handleExceptionGridReady({ api: '/api' });
    expect(component.exceptionGridApi).toEqual('/api')
  })

  it('onPageChange method should call exceptionEntitySwitch', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.onPageChange();
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  });

  it('exceptionEntitySwitch method should switch tab to getDatasets - tab 2 ', () => {
    component.tabs = 2;
    spyOn(component, 'getDatasets')
    component.exceptionEntitySwitch();
    expect(component.getDatasets).toHaveBeenCalled()
  })

  it('exceptionEntitySwitch method should switch tab to exception reports - tab 1 ', () => {
    component.tabs = 1;
    spyOn(component, 'getExceptionReports')
    component.exceptionEntitySwitch();
    expect(component.getExceptionReports).toHaveBeenCalled()
  });

  it('disable comparator method should return 0',()=>{
    let res = component.disableComparator({},{});
    expect(res).toEqual(0)
  })

  it('currentPageChange method should set current page', () => {
    component.currentPageChange(3);
    expect(component.pageInfoData.currentPage).toEqual(0)
  })

  it('updatePageSize method should set page size', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.updatePageSize(20);
    expect(component.pageInfoData.pageSize).toEqual(20);
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('searchGrid method should set filter, currentPage and call exceptionEntitySwitch method', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.searchGrid('name');
    expect(component.pageInfoData.filter).toEqual('');
    expect(component.pageInfoData.currentPage).toEqual(0);
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('searchGrid method should set filter, currentPage and call exceptionEntitySwitch method - tab 2', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.tabs= 2
    component.searchGrid('name');
    expect(component.pageInfoData.filter).toEqual('name');
    expect(component.pageInfoData.currentPage).toEqual(0);
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('sortChanged method should call exceptionEntitySwitch method', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.sortChanged('name');
    expect(component.pageInfoData.sort).toEqual('');
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('commentAdded method should call getFiles once comment added', () => {
    component.tabs = 2;
    spyOn(component, 'getFiles')
    component.commentAdded();
    expect(component.getFiles).toHaveBeenCalled()
  })

  it('commentAdded method should call getExceptionReports once comment added', () => {
    component.tabs = 1;
    spyOn(component, 'getExceptionReports')
    component.commentAdded();
    expect(component.getExceptionReports).toHaveBeenCalled()
  });

  it('openComments method should open comments and set enities data', () => {
    component.filingDetails = {
      filingName: 'FDI Loan',
      period: '2011'
    }
    component.tabs = 2;
    let row = {
      entityId: '101'
    };
    component.openComments(row);
    expect(component.commentsName).toEqual('FDI Loan // 2011');
    expect(component.commentEntityType).toEqual('DataSet')
    expect(component.showComments).toEqual(true)
  })

  it('openComments method should open comments and set exception data comments', () => {
    component.filingDetails = {
      filingName: 'FDI Loan',
      period: '2011'
    }
    component.tabs = 1;
    let row = {
      exceptionId: '101'
    };
    component.openComments(row);
    expect(component.commentsName).toEqual('FDI Loan // 2011');
    expect(component.commentEntityType).toEqual('Data Exception Report')
    expect(component.showComments).toEqual(true)
  });

  it('routeToExceptionDetailsPage method should set exception data and navigate user to view-exception-reports page', () => {
    spyOn(component['router'], 'navigate');
    let mockData = {
      data: {}
    }
    component.filingDetails = {
      filingName: 'FDI Loan',
      period: '2011',
      dueDate: ''
    }
    component.routeToExceptionDetailsPage(mockData);
    expect(component['router'].navigate).toHaveBeenCalled()
  });

  it('exportData method should export data filing entities - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(true);
    spyOn(component['service'], 'exportIntakeData').and.callFake(() => {
      return of({})
    })
    component.exportData('exceptions');
    expect(component['service'].exportIntakeData).toHaveBeenCalled()
  })

  it('exportData method should export data exceptions -no permission - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(false);
    spyOn(component['service'], 'exportIntakeData').and.callFake(() => {
      return of({})
    })
    component.exportData('exceptions');
    expect(component['service'].exportIntakeData).toHaveBeenCalled()
  })

  it('exportData method should export data for dataset - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['service'], 'exportIntakeData').and.callFake(() => {
      return of({})
    })
    component.exportData('dataset');
    expect(component['service'].exportIntakeData).toHaveBeenCalled()
  })

  it('exportData method should export data for accordion - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['service'], 'exportIntakeData').and.callFake(() => {
      return of({})
    })
    component.exportData('accordion');
    expect(component['service'].exportIntakeData).toHaveBeenCalled()
  })

  it('markAsCompleteClick method should mark as complete', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['service'], 'markDatantakeComplete').and.callFake(() => {
      return of({})
    })
    component.markAsCompleteClick()
    expect(component['service'].markDatantakeComplete).toHaveBeenCalled()
  })

  it('markAsCompleteClick method should mark as complete', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }

    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['service'], 'markDatantakeComplete').and.returnValue(throwError(errorResponse))
    component.markAsCompleteClick()
    expect(component['service'].markDatantakeComplete).not.toHaveBeenCalled()
  })

  xit('onSubmitApproveExceptionReports method should call api to submit exceptions reports for approval', fakeAsync(() => {
    component.filingDetails = {
      filingName: 'Form pf',
      period: 'Q1 2021'
    }

    component.exceptionReportRows = [
      {
        approved: false,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "akshay.raskar@ey.com",
        unresolved: 1,
        resolved: 0
      }
    ] as any

    component.exceptionData = [
      {
        approved: false,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "akshay.raskar@ey.com",
        unresolved: 1,
        resolved: 0
      }
    ]

    let mockResp = {
      data: {
        answerExceptions: [
          {
            approved: true,
            exceptionId: 8604,
            entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
            fundId: "21114980",
            updatedBy: "nitin.madake@ey.com",
            unresolved: 1,
            resolved: 0
          }
        ]
      }
    }

    spyOn(component['service'], 'approveExceptionReports').and.callFake(() => {
      return of(mockResp)
    });
    component.onSubmitApproveExceptionReports();
    expect(component.exceptionData).toEqual([
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 1,
        resolved: 0
      }
    ])
    flush();
  })
  )

  it('getDatasets method should fetch the data', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    let mockResp = [
      { id: 1211, reg_reporting: 'form PF' }
    ]
    spyOn(component['service'], 'getDatasetsrecords').and.callFake(() => {
      return of(mockResp)
    });
    component.getDatasets(true);
    expect(component['service'].getDatasetsrecords).toHaveBeenCalled()
  })

  it('getDatasets method should handle error on fetching the data - negative', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    let mockResp = [
      { id: 1211, reg_reporting: 'form PF' }
    ]

    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['service'], 'getDatasetsrecords').and.returnValue(throwError(errorResponse))
    component.getDatasets(true);
    expect(component['service'].getDatasetsrecords).toHaveBeenCalled()
  })

  it('getBDFilesList method should fetch db list',()=>{
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }

    component.filesListArr = [
      {
        exceptionDue:'01/03/2022',
        lastFileDueDate:'02/03/2022' 
      }
    ]

    component.getBDFilesList({index:0})
    spyOn(component['service'], 'getBDFilesList').and.callFake(() => {
      return of({})
    });
  })

  it('receiveMessage should set data for - data set',()=>{
    let mockEvent =2;
    spyOn(component,'getDatasets');
    component.receiveMessage(mockEvent);
    expect(component.getDatasets).toHaveBeenCalledWith(true)

  })

  it('receiveMessage should set data for - getExceptionReports',()=>{
    let mockEvent =1;
    spyOn(component,'getExceptionReports');
    component.receiveMessage(mockEvent);
    expect(component.getExceptionReports).toHaveBeenCalledWith(true)

  })


  it('addCommentToException method should open comment modal', () => {
    let mockResult = {
      button : 'Submit',
      data :{
        assignTo:'abcd',
        comment:'',
        files:''
      }
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }

    component.exceptionData = [{exceptionId :'101',comments:0}]
    spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    spyOn(component,'createEntitiesRowData');
    component.addCommentToException({exceptionId:'101'})
    expect(component.exceptionData).toEqual([{exceptionId :'101',comments:1}]);
    expect(component.createEntitiesRowData).toHaveBeenCalled()
  });


  it('addCommentToDatasets method should open comment modal', () => {
    let mockResult = {
      button : 'Submit',
      data :{
        assignTo:'abcd',
        comment:'',
        files:''
      }
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }
    component.datasets = [{exceptionId :'101',comments:0}] as any;
    spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    spyOn(component,'createEntitiesRowData');
    component.addCommentToDatasets({exceptionId:'101'})
    expect(component.datasets).toEqual([{exceptionId :'101',comments:1}] as any);
    expect(component.createEntitiesRowData).toHaveBeenCalled()

  });

  it('onSubmitApproveDatasets ',()=>{
    component.datasetsSelectedRows = [
      { exceptionId :'101',approved:false}
    ]
    component.datasets=[{ exceptionId :'101',approved:false}] as any
    spyOn(component,'createEntitiesRowData');
    component.onSubmitApproveDatasets();
    expect(component.datasets).toEqual([{ exceptionId :'101',approved:true}]as any);
    expect(component.createEntitiesRowData).toHaveBeenCalled()
  })

  it('getFilingStatusDetails method should',()=>{
    let mockEvent=[
      {stageCode:'DATA_INTAKE',progress:'COMPLETED'}
    ]
    component.getFilingStatusDetails(mockEvent);
    expect(component.intakeStageCompleted).toEqual(true)
  })

  it('datasetsReportRowsSelected method should select rows',()=>{
    let mockData = [
      { id:'101'}
    ]
    component.datasetsReportRowsSelected(mockData)
    expect(component.datasetsSelectedRows).toEqual([{id:'101'}])
  })
});
