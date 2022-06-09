import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

import { RrReportingComponent } from './rr-reporting.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RrReportingService } from '../services/rr-reporting.service';
import { MatDialogModule } from '@angular/material/dialog';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { DatePipe } from '@angular/common';
import { GridApi } from 'ag-grid-community';

describe('RrReportingComponent', () => {
  let component: RrReportingComponent;
  let fixture: ComponentFixture<RrReportingComponent>;
  let testBedService: RrReportingService;

  let regulatoryReportingFilingServiceStub = {
    invokeFilingDetails: () => { },
    checkFilingCompletedStatus: () => { }
  };

  let rrReportingServiceStub = {
    getExceptionReports: () => { },
    getfilingEntities: () => { },
    approvefilingEntities: () => { },
    approveAnswerExceptions: () => { },
    unApprovefilingEntities: () => { },
    unApproveAnswerExceptions: () => { },
    exportRRData: () => { },
    getAuditlog: () => { }
  }

  let eycRrSettingsServiceStub = {
    regReportingFiling: {
      rr_filing_entities: '/rr_filing_entities/',
      rr_exception_reports: '/rr_exception_reports/'
    }
  }
  let gridApiStub = {
    getSelectedRows: () => { }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RrReportingComponent],
      imports: [HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule],
      providers: [HttpClient, DatePipe,
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
        { provide: RrReportingService, useValue: rrReportingServiceStub },
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: GridApi, useValue: gridApiStub }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(RrReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(RrReportingService)
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resetData method should reset the data', () => {
    spyOn(component, 'createEntitiesRowData');
    component.resetData();
    expect(component.currentPage).toEqual(0);
    expect(component.pageSize).toBe(20)
  });

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
    spyOn(component['rrservice'], 'getExceptionReports').and.callFake(() => {
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
    spyOn(component['rrservice'], 'getExceptionReports').and.callFake(() => {
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
    spyOn(component['rrservice'], 'getExceptionReports').and.returnValue(throwError(errorResponse))
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
    spyOn(component['rrservice'], 'getfilingEntities').and.callFake(() => {
      return of(mockResp)
    })
    component.getFilingEntities(true);
    expect(component.rowData).toEqual(mockResp['data']);
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
    spyOn(component['rrservice'], 'getfilingEntities').and.returnValue(throwError(errorResponse))
    component.getFilingEntities();
    expect(component.rowData).toEqual([])
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
  });

  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data'
    };

    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data')
  });

  it('receiveMessage method should set modal message for filling entities tab', () => {
    spyOn(component, 'getFilingEntities');
    component.receiveMessage(2);
    expect(component.tabs).toEqual(2);
    expect(component.currentPage).toEqual(0);
    expect(component.filter).toEqual('');
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([]);
    expect(component.filingEntityApprovedSelectedRows).toEqual([]);
    expect(component.modalMessage).toEqual("Are you sure you want to approve the selected exception report(s)? This will move them to client review.");
    expect(component.getFilingEntities).toHaveBeenCalledWith(true);
  });


  it('receiveMessage method should set modal message for exception reports tab', () => {
    spyOn(component, 'getExceptionReports');
    component.receiveMessage(1);
    expect(component.tabs).toEqual(1);
    expect(component.currentPage).toEqual(0);
    expect(component.filter).toEqual('');
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([]);
    expect(component.filingEntityApprovedSelectedRows).toEqual([]);
    expect(component.modalMessage).toEqual("Are you sure you want to approve the selected exception report(s)? This will advance them to the next reviewer.");
    expect(component.getExceptionReports).toHaveBeenCalledWith(true);
  });

  it('receiveFilingDetails method should set fillingdetails and modal message for exception reports tab', () => {
    component.tabs = 1;
    let mockEvent = {
      fillingName: 'Form pf'
    }
    spyOn(component, 'getExceptionReports');
    component.receiveFilingDetails(mockEvent);
    expect(component.filingDetails).toEqual(mockEvent);
    expect(component.modalMessage).toEqual('Are you sure you want to approve the selected exception reports? This will advance them to the next reviewer.')
  })

  it('receiveFilingDetails method should set fillingdetails and modal message for filling entites tab', () => {
    component.tabs = 2;
    let mockEvent = {
      fillingName: 'Form pf'
    }
    spyOn(component, 'getFilingEntities');
    component.receiveFilingDetails(mockEvent);
    expect(component.filingDetails).toEqual(mockEvent);
    expect(component.modalMessage).toEqual('Are you sure you want to approve the selected exception reports? This will move them to client review.')
  })

  it('onSubmitTest method should show logs', () => {
    spyOn(console, 'log')
    component.onSubmitTest()
  })

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
    ]

    component.rowData = [{
      approved: false,
      entityId: 8604,
      entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
      fundId: "21114980",
      reviewLevel: "L2 Review",
      updatedBy: "Akshay.raskar@ey.com",
    }]

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

    spyOn(component['rrservice'], 'approvefilingEntities').and.callFake(() => {
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
    }]);
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

    spyOn(component['rrservice'], 'approvefilingEntities').and.returnValue(throwError(errorResponse))
    component.onSubmitApproveFilingEntities()
  });

  it('disableComparator method should return 0', () => {
    let res = component.disableComparator({}, {});
    expect(res).toEqual(0);
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

  it('onSubmitApproveExceptionReports method should call api to submit exceptions reports for approval', fakeAsync(() => {
    component.filingDetails = {
      filingName: 'Form pf',
      period: 'Q1 2021'
    }

    component.exceptionReportToApproveSelectedRows = [
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

    spyOn(component['rrservice'], 'approveAnswerExceptions').and.callFake(() => {
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

  it('exceptionReportRowsSelected method should select exception reports', () => {
    let mockEvent = [
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 1,
        resolved: 0
      },
      {
        approved: false,
        exceptionId: 8554,
        entityName: "GOLDMAN SACHS FORM",
        fundId: "212234980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 2,
        resolved: 1
      },
    ]

    component.exceptionReportRowsSelected(mockEvent);
    expect(component.selectedRows).toEqual(mockEvent);
    expect(component.exceptionReportToApproveSelectedRows).toEqual([{
      approved: false,
      exceptionId: 8554,
      entityName: "GOLDMAN SACHS FORM",
      fundId: "212234980",
      updateBy: "nitin.madake@ey.com",
      unresolved: 2,
      resolved: 1
    }]);
    expect(component.exceptionReportToUnaproveSelectedRows).toEqual([
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

  })

  it('filingEnitiesRowsSelected method should select filling entities', () => {
    let mockEvent = [
      {
        approved: true,
        entityId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 1,
        resolved: 0
      },
      {
        approved: false,
        entityId: 8554,
        entityName: "GOLDMAN SACHS FORM",
        fundId: "212234980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 2,
        resolved: 1
      },
    ]

    component.filingEnitiesRowsSelected(mockEvent);
    expect(component.selectedRows).toEqual(mockEvent);
    expect(component.filingEntityApprovedSelectedRows).toEqual([{
      approved: false,
      entityId: 8554,
      entityName: "GOLDMAN SACHS FORM",
      fundId: "212234980",
      updateBy: "nitin.madake@ey.com",
      unresolved: 2,
      resolved: 1
    }]);
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([
      {
        approved: true,
        entityId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        fundId: "21114980",
        updateBy: "nitin.madake@ey.com",
        unresolved: 1,
        resolved: 0
      }
    ])
  })

  it('onClickMyTask method should set myTask - positive', () => {
    component.exceptionDataForFilter = [
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: true
      }
    ]
    component.onClickMyTask(true);
    expect(component.exceptionData).toEqual([
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: true
      }
    ])
  })


  it('onClickMyTask method should set myTask - negative', () => {
    component.exceptionDataForFilter = [
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: true
      },
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: false
      }
    ]
    component.onClickMyTask(false);
    expect(component.exceptionData).toEqual([
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: true
      },
      {
        approved: true,
        exceptionId: 8604,
        entityName: "CL BUY AND MAINTAIN FIXED INCOME LP",
        mytask: false
      }
    ])
  });

  it('openComments method should set comments data - fillng entities', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }
    component.tabs = 2;
    let mockRow = {
      entityId: 20334
    }
    component.openComments(mockRow);
    expect(component.commentsName).toEqual('form pf // Q1 2022');
    expect(component.commentEntityType).toEqual('Filing Entity');
    expect(component.entityId).toEqual(20334);
    expect(component.showComments).toEqual(true)
  })

  it('openComments method should set comments data - exception reports', () => {
    component.filingDetails = {
      filingName: 'form pf',
      period: 'Q1 2022'
    }
    component.tabs = 1;
    let mockRow = {
      exceptionId: 20334
    }
    component.openComments(mockRow);
    expect(component.commentsName).toEqual('form pf // Q1 2022');
    expect(component.commentEntityType).toEqual('Answer Data Exception Report');
    expect(component.entityId).toEqual(20334);
    expect(component.showComments).toEqual(true)
  })

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
    ]

    component.rowData = [
      {
        approved: true,
        entityId: 1011,
        reviewLevel: 'Approved',
        updatedBy: 'nitin.madake@ey.com'
      }
    ]

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

    spyOn(component['rrservice'], 'unApprovefilingEntities').and.callFake(() => {
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

    ])
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.selectedRows).toEqual([])
  })

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

    spyOn(component['rrservice'], 'unApprovefilingEntities').and.returnValue(throwError(errorResponse))
    spyOn(component, 'createEntitiesRowData');
    component.unApproveEntity()
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.filingEntityApprovedSelectedRows).toEqual([])
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([])

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
    ]

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

    spyOn(component['rrservice'], 'unApproveAnswerExceptions').and.callFake(() => {
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
    spyOn(component['rrservice'], 'unApproveAnswerExceptions').and.returnValue(throwError(errorResponse))
    spyOn(component, 'createEntitiesRowData');
    component.unApproveException()
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component.filingEntityApprovedSelectedRows).toEqual([])
    expect(component.filingEntityUnaprovedSelectedRows).toEqual([])
  });

  it('commentAdded method should call getFilingEntities', () => {
    component.tabs = 2;
    spyOn(component, 'getFilingEntities');
    component.commentAdded();
    expect(component.getFilingEntities).toHaveBeenCalled()
  })

  it('commentAdded method should call getExceptionReports', () => {
    component.tabs = 1;
    spyOn(component, 'getExceptionReports');
    component.commentAdded();
    expect(component.getExceptionReports).toHaveBeenCalled()
  });

  it('routeToExceptionDetailsPage method should navigate to view exception reports page', () => {
    spyOn(component['router'], 'navigate');
    component.routeToExceptionDetailsPage({ data: {} });
    expect(component['router'].navigate).toHaveBeenCalledWith(['/view-exception-reports'], { state: { componentStage: 'Reporting' } })
  })

  it('routeToFilingEntityExceptionPage method should navigate to view filling entity page', () => {
    spyOn(component['router'], 'navigate');
    component.routeToFilingEntityExceptionPage({ data: {} });
    expect(component['router'].navigate).toHaveBeenCalledWith(['/view-filing-entity-exception'], { state: { componentStage: 'Reporting' } })
  })

  it('exportData method should export data filing entities - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(true);
    spyOn(component['rrservice'], 'exportRRData').and.callFake(() => {
      return of({})
    })
    component.exportData('entities');
    let exportURL = "/rr_filing_entities/&filingName=form PF&period=Q1 2022&export=true&headers=fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,commentsCount:Comments,updatedBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['rrservice'].exportRRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data filing entities', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(false);
    spyOn(component['rrservice'], 'exportRRData').and.callFake(() => {
      return of({})
    })
    component.exportData('entities');
    let exportURL = "/rr_filing_entities/&filingName=form PF&period=Q1 2022&export=true&headers=fundId:ID,entityName:Entity Name,unResolvedException:Unresolved,resolvedException:Resolved,reviewLevel:Review Level,updatedBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['rrservice'].exportRRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data exception reports - view comments', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(true);
    spyOn(component['rrservice'], 'exportRRData').and.callFake(() => {
      return of({})
    })
    component.exportData('exception reports');
    let exportURL = "/rr_exception_reports/&filingName=form PF&period=Q1 2022&stage=Reporting&export=true&headers=exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,comments:Comments,updateBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['rrservice'].exportRRData).toHaveBeenCalledWith(exportURL)
  })

  it('exportData method should export data exception reports', () => {
    component.filingDetails = {
      filingName: 'form PF',
      period: 'Q1 2022'
    }
    spyOn(component['permissions'], 'validatePermission').and.returnValue(false);
    spyOn(component['rrservice'], 'exportRRData').and.callFake(() => {
      return of({})
    })
    component.exportData('exception reports');
    let exportURL = "/rr_exception_reports/&filingName=form PF&period=Q1 2022&stage=Reporting&export=true&headers=exceptionReportType:Exception Report Type,exceptionReportName:Exception Report Name,reviewLevel:Review Level,unresolved:Unresolved,resolved:Resolved,updateBy:Last Updated By&reportType=csv"
    expect(component.exportURL).toEqual(exportURL)
    expect(component['rrservice'].exportRRData).toHaveBeenCalledWith(exportURL)
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
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

    spyOn(component['rrservice'], 'getAuditlog').and.callFake(() => {
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
    }]
    expect(component.auditLogs).toEqual(auditLogs)
  })
}); 
