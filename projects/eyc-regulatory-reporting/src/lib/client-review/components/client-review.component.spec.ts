import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { ClientReviewComponent } from './client-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../src/environments/environment';
import { ClientReviewService } from '../services/client-review.service';
import { of, throwError } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MotifCardModule, MotifButtonModule, MotifFormsModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifPaginationModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
describe('ClientReviewComponent', () => {
  let component: ClientReviewComponent;
  let fixture: ComponentFixture<ClientReviewComponent>;
  let testBedService: ClientReviewService;

  let clientReviewServiceStub = {
    getExceptionReports: () => { },
    getfilingEntities: () => { },
    approvefilingEntities: () => { },
    approveAnswerExceptions: () => { },
    unApproveAnswerExceptions:()=>{
      return of({})
    },
    unApprovefilingEntities:()=>{
      return of({})
    
    },
    exportCRData:()=>{},
    getAuditlog:()=>{}
  };

  let eycRrSettingsServiceStub = {
    regReportingFiling  : {
      client_review_filing_entities : '/client_review_filing_entities/',
      rr_exception_reports : '/rr_exception_reports/'
    }
  }

  let regulatoryReportingFilingServiceStub = {
    invokeFilingDetails: () => { },
    checkFilingCompletedStatus :()=>{},
  };

  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }

    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClientReviewComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        ClientReviewService,DatePipe,
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
        { provide: ClientReviewService, useValue: clientReviewServiceStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(ClientReviewService)
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnDestroy method should remove item from session storage', () => {
    spyOn(sessionStorage, 'removeItem');
    component.ngOnDestroy();
    expect(sessionStorage.removeItem).toHaveBeenCalled()
  })


  it('getExceptionReports method should call api and get exception reports when resetdata is true', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }

    const mockResp = {
      data: {
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
      },
      totalRecords: 1
    }
    spyOn(component['service'], 'getExceptionReports').and.callFake(() => {
      return of(mockResp)
    });
    spyOn(component, 'resetData')
    component.getExceptionReports(true);
    expect(component.exceptionData).toEqual(mockResp['data']);
    expect(component.totalRecords).toEqual(1);
    expect(component.resetData).toHaveBeenCalled();
  });

  it('getExceptionReports method should call api and get exception reports when component renders for the first time', () => {
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
    spyOn(component, 'resetData');
    component.getExceptionReports(false);
    expect(component.exceptionData).toEqual(mockResp['data']);
    expect(component.totalRecords).toEqual(1);
    expect(component.resetData).not.toHaveBeenCalled();
  });

  it('getExceptionReports method should call api and should handle an error', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }


    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['service'], 'getExceptionReports').and.returnValue(throwError(errorResponse))
    component.getExceptionReports();
    expect(component.exceptionData).toEqual([])
  });



  it('getFilingEntities method should call api and get Filing Entities when component renders first time', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }

    const mockResp = {
      data: [{
        approved: true,
        comments: [],
        commentsCount: 1,
        entityGroup: "",
        entityId: 7150,
        entityName: "GOLDMAN SACHS FUNDS - GOLDMAN SACHS ASIA HIGH YIELD BOND PORTFOLIO",
        fundId: "PV103633",
        resolvedException: "1",
        reviewLevel: "Client Review",
        unResolvedException: 2,
        updatedBy: "Akshay.Raskar1@ey.com",
        updatedDate: "2022-05-31 09:42:07.524036",
      }],
      totalRecords: 1
    }
    spyOn(component['service'], 'getfilingEntities').and.callFake(() => {
      return of(mockResp)
    })
    component.getFilingEntities(true);
    expect(component.rowData).toEqual(mockResp['data'] as any);
    expect(component.totalRecords).toEqual(1)
  });


  it('getFilingEntities method should call api and should handle an error', () => {
    component.filingDetails = {
      filingName: 'Form PF',
      period: 'Q1 2022'
    }


    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['service'], 'getfilingEntities').and.returnValue(throwError(errorResponse))
    component.getFilingEntities();
    expect(component.rowData).toEqual([])
  });

  
  it('onSubmitApproveFilingEntities method should call api to submit filling entities for approval', fakeAsync(() => {
    component.filingDetails = {
      filingName: 'Form pf',
      period: 'Q1 2022'
    }

    component.filingEntityApprovedSelectedRows = [
      {
        approved: false,
        entityId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        reviewLevel: "L2 Review",
        updatedBy: "Akshay.raskar@ey.com",
      }
    ] as any

    component.rowData = [{
      approved: false,
      entityId: 8604,
      entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
      fundId: "21114980",
      reviewLevel: "L2 Review",
      updatedBy: "Akshay.raskar@ey.com",
    }] as any

    let mockResp = {
      data: [{
        approved: false,
        entityId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        reviewLevel: "Client Review",
        updatedBy: "nitin.madake@ey.com",
      }]
    }

    spyOn(component['service'], 'approvefilingEntities').and.callFake(() => {
      return of(mockResp)
    })

    component.onSubmitApproveFilingEntities()
    expect(component.rowData).toEqual([{
      approved: true,
      entityId: 8604,
      entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
      fundId: "21114980",
      reviewLevel: "Client Review",
      updatedBy: "nitin.madake@ey.com",
    }] as any);
    expect(component.showToastAfterApproveFilingEntities).toEqual(true)
    tick(5000);
    expect(component.showToastAfterApproveFilingEntities).toEqual(false)
    flush();
  })
  )

  it('onSubmitApproveFilingEntities method should handle api error on submit filling entities for approval', () => {
    component.filingDetails = {
      filingName: 'Form pf',
      period: 'Q1 2022'
    }

    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })

    spyOn(component['service'], 'approvefilingEntities').and.returnValue(throwError(errorResponse))
    component.onSubmitApproveFilingEntities()
  });


  it('receiveMessage method should call getExceptionReports method', () => {
    spyOn(component, 'getExceptionReports');
    component.receiveMessage(1);
    expect(component.tabs).toEqual(1);
    expect(component.modalMessage).toEqual('Are you sure you want to approve these exception reports?');
    expect(component.getExceptionReports).toHaveBeenCalled()
  })

  it('receiveMessage method should call getFilingEntities method', () => {
    spyOn(component, 'getFilingEntities');
    component.receiveMessage(2);
    expect(component.tabs).toEqual(2);
    expect(component.modalMessage).toEqual(' Are you sure you want to approve the selected entities? This will approve them for submission.');
    expect(component.getFilingEntities).toHaveBeenCalled()
  });

  it('receiveMessage method should not call getFilingEntities method', () => {
    spyOn(component, 'getFilingEntities');
    component.receiveMessage(3);
    expect(component.tabs).toEqual(3);
    expect(component.getFilingEntities).not.toHaveBeenCalled()
  });


  it('receiveFilingDetails method should set filingDetails and call getFilingEntities method', () => {
    let mockEventData = {
      data: []
    }
    component.tabs = 2;
    spyOn(component, 'getFilingEntities');
    component.receiveFilingDetails(mockEventData);
    expect(component.filingDetails).toEqual({ data: [] });
    expect(component.getFilingEntities).toHaveBeenCalled()
  });

  it('receiveFilingDetails method should set filingDetails and call getExceptionReports method', () => {
    let mockEventData = {
      data: []
    }
    component.tabs = 1;
    spyOn(component, 'getExceptionReports');
    component.receiveFilingDetails(mockEventData);
    expect(component.filingDetails).toEqual({ data: [] });
    expect(component.getExceptionReports).toHaveBeenCalled()
  });

  it('unApproveEntity method should call api and unapprove the filling entity', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }

    component.filingEntityUnaprovedSelectedRows = [
      {
        approved: true,
        entityId: 1011,
        reviewLevel: 'Approved',
        updatedBy: 'nitin.madake@ey.com'
      }
    ]as any

    component.rowData = [
      {
        approved: true,
        entityId: 1011,
        reviewLevel: 'Approved',
        updatedBy: 'nitin.madake@ey.com'
      }
    ] as any

    let mockResp = {
      data: [
        {
          approved: false,
          entityId: 1011,
          reviewLevel: 'Client Review',
          updatedBy: 'nitin.madake@ey.com'
        }
      ]
    }

    spyOn(component['service'], 'unApprovefilingEntities').and.callFake(() => {
      return of(mockResp)
    })
    spyOn(component, 'createEntitiesRowData');
    component.unApproveEntity()
    expect(component.rowData).toEqual([
      {
        approved: false,
        entityId: 1011,
        reviewLevel: 'Client Review',
        updatedBy: 'nitin.madake@ey.com'
      }

    ] as any)
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.selectedRows).toEqual([])
  })

  it('unApproveException method should call api and unapprove the exception report', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }

    component.exceptionReportToUnaproveSelectedRows = [
      {
        approved: true,
        exceptionId: 1011,
        updatedBy: 'nitin.madake@ey.com',
        resolved: '1',
        unresolved: '1',
      }
    ] as any

    component.exceptionData = [
      {
        approved: true,
        exceptionId: 1011,
        updateBy: 'nitin.madake@ey.com',
        resolved: '1',
        unresolved: '1',
      }
    ]

    let mockResp = {
      data: [
        {
          approved: false,
          entityId: 1011,
          updatedBy: 'nitin.madake@ey.com',
          resolved: '1',
          unresolved: '1',
        }
      ]
    }

    spyOn(component['service'], 'unApproveAnswerExceptions').and.callFake(() => {
      return of(mockResp)
    })
    spyOn(component, 'createEntitiesRowData');
    component.unApproveException()
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.filingEntityApprovedSelectedRows).toEqual([])
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([])
  })


  it('unApproveException method should handle unapprove the exception report api error', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }
    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['service'], 'unApproveAnswerExceptions').and.returnValue(throwError(errorResponse))
    spyOn(component, 'createEntitiesRowData');
    component.unApproveException()
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.filingEntityApprovedSelectedRows).toEqual([])
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([])
  });

  it('unApproveEntity method should handle api error to unapprove the filling entity', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }

    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })

    spyOn(component['service'], 'unApprovefilingEntities').and.returnValue(throwError(errorResponse))
    spyOn(component, 'createEntitiesRowData');
    component.unApproveEntity()
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.filingEntityApprovedSelectedRows).toEqual([])
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([])

  })



  it('exceptionReportRowsSelected method should add selected rows to exceptionReportRows ', () => {
    let mockEvent = [
      {
        approved:true,
        exceptionId:234
      },
      {
        approved:false,
        exceptionId:235
      }
    ]
    component.exceptionReportRowsSelected(mockEvent);
    expect(component.exceptionReportToApproveSelectedRows).toEqual([{ approved: false, exceptionId: 235 }] as any)
  });

  it('filingEnitiesRowsSelected method should add selected rows to selectedRows ', () => {
    let mockSelectedRows = [
      { entityId: 101, approved: false },
      { entityId: 102, approved: false },
    ];

    component.filingEnitiesRowsSelected(mockSelectedRows);
    expect(component.selectedRows).toEqual([
      { entityId: 101, approved: false },
      { entityId: 102, approved: false },
    ] as any)
  });

  it('onClickMyTask method should add exception data if myTask is true', () => {
    component.exceptionDataForFilter = [
      { name: 'FDI', mytask: true },
      { name: 'Loan', mytask: false }
    ]as any
    component.onClickMyTask(true);
    expect(component.exceptionData).toEqual([
      { name: 'FDI', mytask: true }
    ])
  })


  it('onClickMyTask method should add exception data if myTask is false', () => {
    component.exceptionDataForFilter = [
      { name: 'FDI', mytask: true },
      { name: 'Loan', mytask: false }
    ]as any
    component.onClickMyTask(false);
    expect(component.exceptionData).toEqual([
      { name: 'FDI', mytask: true },
      { name: 'Loan', mytask: false }
    ])
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
    expect(component.commentEntityType).toEqual('Filing Entity')
    expect(component.entityId).toEqual('101')
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
    expect(component.commentEntityType).toEqual('Answer Data Exception Report')
    expect(component.entityId).toEqual('101')
    expect(component.showComments).toEqual(true)
  });

  it('actionMenuEnableforException method should enable action menu for exception', fakeAsync(() => {
    let row = {
      exceptionId: '101'
    };
    component.actionMenuEnableforException(row);
    expect(component.selectedExceptionId).toEqual('101')
    tick(1)
    expect(component.actionMenuModalEnabled).toEqual(true)
    expect(component.actionMenuModal).toEqual(true)
  }));

  it('commentAdded method should call getFilingEntities once comment added', () => {
    component.tabs = 2;
    spyOn(component, 'getFilingEntities')
    component.commentAdded();
    expect(component.getFilingEntities).toHaveBeenCalled()
  })

  it('commentAdded method should call getExceptionReports once comment added', () => {
    component.tabs = 1;
    spyOn(component, 'getExceptionReports')
    component.commentAdded();
    expect(component.getExceptionReports).toHaveBeenCalled()
  });

  it('routeToExceptionDetailsPage method should set exception data and navigate user to view-exception-reports page', () => {
    spyOn(component['router'], 'navigate');
    let mockData = {
      data: {}
    }
    component.routeToExceptionDetailsPage(mockData);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/view-exception-reports'],{ state: { componentStage: 'Client review' }});
  });

  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data'
    };

    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data')
  });

  it('isFirstColumn method should set first colummn', () => {
    let mockData = {
      data: {
        approved: false
      },
      columnApi: {
        getAllDisplayedColumns: () => {
          return [{ column: '' }]
        }
      }
    }
    component.isFirstColumn(mockData);
  })

  it('createEntitiesRowData method should create row data', fakeAsync(() => {
    component.filingDetails = {
      status: []
    }
    component.createEntitiesRowData()
    tick(1)
  }));


  it('addComment method should open comment modal', () => {
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
    spyOn(component,'createEntitiesRowData');

    component.rowData = [{entityId :'101',commentsCount:0}] as any
    spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    component.addComment({entityId:'101'})
    expect(component.createEntitiesRowData).toHaveBeenCalled()

  });

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

  it('resetData method should reset the data', () => {
    spyOn(component, 'createEntitiesRowData');
    component.resetData();
    expect(component.currentPage).toEqual(0);
    expect(component.pageSize).toBe(20)
  });

  it('exceptionEntitySwitch method should switch tab to filling entities - tab 2 ', () => {
    component.tabs = 2;
    spyOn(component, 'getFilingEntities')
    component.exceptionEntitySwitch(true);
    expect(component.getFilingEntities).toHaveBeenCalledWith(true)
  })

  it('exceptionEntitySwitch method should switch tab to exception reports - tab 1 ', () => {
    component.tabs = 1;
    spyOn(component, 'getExceptionReports')
    component.exceptionEntitySwitch(true);
    expect(component.getExceptionReports).toHaveBeenCalledWith(true)
  });

  it('onPageChange method should call exceptionEntitySwitch', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.onPageChange();
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  });

  it('currentPageChange method should set current page', () => {
    component.currentPageChange(3);
    expect(component.currentPage).toEqual(2)
  })

  it('updatePageSize method should set page size', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.updatePageSize(20);
    expect(component.pageSize).toEqual(20);
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('searchGrid method should set filter, currentPage and call exceptionEntitySwitch method', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.searchGrid('name');
    expect(component.filter).toEqual('name');
    expect(component.currentPage).toEqual(0);
    expect(component.exceptionEntitySwitch).toHaveBeenCalledWith(true)
  })

  it('sortChanged method should call exceptionEntitySwitch method', () => {
    spyOn(component, 'exceptionEntitySwitch');
    component.sortChanged('name');
    expect(component.sort).toEqual('name');
    expect(component.exceptionEntitySwitch).toHaveBeenCalled()
  })

  it('routeToFilingEntityExceptionPage method should navigate to view filling entity page', () => {
    spyOn(component['router'], 'navigate');
    component.routeToFilingEntityExceptionPage({ data: {} });
    expect(component['router'].navigate).toHaveBeenCalledWith(['/view-filing-entity-exception'], { state: { componentStage: 'Client review' } })
  })

  it('exportData method should export data filing entities - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(true);
    spyOn(component['service'], 'exportCRData').and.callFake(() => {
      return of({})
    })
    component.exportData('entities');
    let exportURL = "/client_review_filing_entities/&filingName=form PF&period=Q1 2022&export=true&headers=fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,commentsCount:Comments,updatedBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['service'].exportCRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data filing entities', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(false);
    spyOn(component['service'], 'exportCRData').and.callFake(() => {
      return of({})
    })
    component.exportData('entities');
    let exportURL = "/client_review_filing_entities/&filingName=form PF&period=Q1 2022&export=true&headers=fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,updatedBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['service'].exportCRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data exception reports - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(true);
    spyOn(component['service'], 'exportCRData').and.callFake(() => {
      return of({})
    })
    component.exportData('exception reports');
    let exportURL = "/rr_exception_reports/filingName=form PF&period=Q1 2022&stage=Client review&export=true&headers=exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,comments:Comments,updateBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['service'].exportCRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data exception reports', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(false);
    spyOn(component['service'], 'exportCRData').and.callFake(() => {
      return of({})
    })
    component.exportData('exception reports');
    let exportURL = "/rr_exception_reports/filingName=form PF&period=Q1 2022&stage=Client review&export=true&headers=exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,updateBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['service'].exportCRData).toHaveBeenCalledWith(exportURL)
  })

  it('onClickLastUpdatedByEntity method should set auditLogs details for - auditActionType - New - filling entity', () => {
    let row = {
      entityId: 8632,
      entityName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "New",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByEntity(row);
    let auditList = [{
      auditActionType: 'Started',
      auditObjectId: "8632",
      auditObjectType: "Filing Entity",
      modifiedDateTime: "2022-06-02T11:23:56.205Z",
      auditDetails: {
        auditObjectAttribute: "Stage",
        auditObjectPrevValue: "NA",
        auditObjectCurValue: "Reporting"
      }

    },
    {
      subTitle: 'System modified on Jun 02 2022 11:23 AM GMT',
      auditActionType: 'Approve',
      auditObjectId: "8632",
      auditObjectType: "Filing Entity",
      modifiedDateTime: "2022-06-02T11:23:56.205Z",
      auditDetails: {
        auditObjectAttribute: "Stage",
        auditObjectPrevValue: "NA",
        auditObjectCurValue: 'Filing entity ready for reporting'
      }
    }]

    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }]  as any
    expect(component.auditLogs).toEqual(auditLogs)
  })

  it('onClickLastUpdatedByEntity method should set auditLogs details for - auditActionType - Approve -  filling entity', () => {
    let row = {
      entityId: 8632,
      entityName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "Approve",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByEntity(row);
    let auditList = [
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Started",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "NA"
        }
      },
      {
        subTitle: 'Activity prior to this date is not shown in audit history.     System generated note on Jun 02 2022 11:23 AM GMT',
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Recording of events began on this date."
        }

      }
    ]
    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }]as any
    expect(component.auditLogs).toEqual(auditLogs)
  })

  it('onClickLastUpdatedByEntity method should set auditLogs details for - auditActionType - Unapprove -  filling entity', () => {
    let row = {
      entityId: 8632,
      entityName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "Unapprove",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByEntity(row);
    let auditList = [
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Started",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Unapprove",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        subTitle: 'Activity prior to this date is not shown in audit history.     System generated note on Jun 02 2022 11:23 AM GMT',
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Recording of events began on this date."
        }
      }
    ]
    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }] as any
    expect(component.auditLogs).toEqual(auditLogs)
  })


  it('onClickLastUpdatedByException method should set auditLogs details for- auditActionType - New - exception', () => {
    let row = {
      exceptionId: 1299,
      exceptionReportName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "New",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByException(row);
    let auditList = [
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Started",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        subTitle: 'System modified on Jun 02 2022 11:23 AM GMT',
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Exception ready for reporting"
        }
      }
    ]

    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }] as any
    expect(component.auditLogs).toEqual(auditLogs)
  })

  it('onClickLastUpdatedByException method should set auditLogs details for- auditActionType - Approve - exception', () => {
    let row = {
      exceptionId: 1299,
      exceptionReportName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "Approve",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByException(row);
    let auditList = [
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Started",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "NA"
        }
      },
      {
        subTitle: 'Activity prior to this date is not shown in audit history.     System generated note on Jun 02 2022 11:23 AM GMT',
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Recording of events began on this date."
        }
      }
    ]

    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }]as any
    expect(component.auditLogs).toEqual(auditLogs)
  })

  it('onClickLastUpdatedByException method should set auditLogs details for- auditActionType - Unapprove - exception', () => {
    let row = {
      exceptionId: 1299,
      exceptionReportName: "AUSTRALIA ENHANCED INCOME II MASTER COMPANY (IRELAND) LIMITED"
    }
    let mockResp = {
      data: [
        {
          auditObjectId: "8632",
          auditObjectType: "Filing Entity",
          auditActionType: "Unapprove",
          modifiedDateTime: "2022-06-02T11:23:56.205Z",
          auditDetails: {
            auditObjectAttribute: "Stage",
            auditObjectPrevValue: "NA",
            auditObjectCurValue: "Reporting"
          }
        }
      ],
    }

    spyOn(component['service'], 'getAuditlog').and.callFake(() => {
      return of(mockResp);
    });
    component.onClickLastUpdatedByException(row);
    let auditList = [
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Started",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Unapprove",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Reporting"
        }
      },
      {
        subTitle: 'Activity prior to this date is not shown in audit history.     System generated note on Jun 02 2022 11:23 AM GMT',
        auditObjectId: "8632",
        auditObjectType: "Filing Entity",
        auditActionType: "Approve",
        modifiedDateTime: "2022-06-02T11:23:56.205Z",
        auditDetails: {
          auditObjectAttribute: "Stage",
          auditObjectPrevValue: "NA",
          auditObjectCurValue: "Recording of events began on this date."
        }
      }
    ]

    let auditLogs = [{
      duration: 'JUN',
      progress: [...auditList]
    }]as any
    expect(component.auditLogs).toEqual(auditLogs)
  })
});