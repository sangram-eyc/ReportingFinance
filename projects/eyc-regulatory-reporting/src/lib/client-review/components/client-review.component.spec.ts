import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ClientReviewComponent } from './client-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../src/environments/environment';
import { ClientReviewService } from '../services/client-review.service';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
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
    }

  };

  let regulatoryReportingFilingServiceStub = {
    invokeFilingDetails: () => { }
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
        ClientReviewService,
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
        { provide: ClientReviewService, useValue: clientReviewServiceStub },
        { provide: MatDialog, useValue: matDialogStub }
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

  it('getExceptionReports method should fetch exception reports', () => {
    let mockResp = {
      data: [{
        "exceptionId": 11,
        "exceptionReportName": "FDI - Txns For Non-Hedging Purposes",
      }
      ]
    }
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011-11-01'
    }
    spyOn(component['service'], 'getExceptionReports').and.callFake(() => {
      return of(mockResp)
    });
    spyOn(component, 'createEntitiesRowData');
    component.getExceptionReports();
    expect(component['service'].getExceptionReports).toHaveBeenCalledWith('FDI', '2011-11-01', 'Client review');
    expect(component.exceptionData).toEqual([{
      "exceptionId": 11,
      "exceptionReportName": "FDI - Txns For Non-Hedging Purposes",
    }]);
    expect(component.exceptionDataForFilter).toEqual([{
      "exceptionId": 11,
      "exceptionReportName": "FDI - Txns For Non-Hedging Purposes",
    }]);
    expect(component.createEntitiesRowData).toHaveBeenCalled();
  });

  it('getExceptionReports method should handle error if api fails', () => {
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011-11-01'
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

  it('getFilingEntities method should fetch filing entities', () => {
    let mockResp = {
      data: []
    }
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011-11-01'
    }
    spyOn(component['service'], 'getfilingEntities').and.callFake(() => {
      return of(mockResp)
    });
    spyOn(component, 'createEntitiesRowData');
    component.getFilingEntities();
    expect(component['service'].getfilingEntities).toHaveBeenCalledWith('FDI', '2011-11-01');
    expect(component.rowData).toEqual([]);
    expect(component.createEntitiesRowData).toHaveBeenCalled();
  });

  it('getFilingEntities method should handle error if api fails', () => {
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011-11-01'
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

  it('onSubmitApproveFilingEntities method should submit approved filing entities', fakeAsync(() => {
    let mockResp = {
      data: [
        { entityId: 101, entityName: 'EFP', approved: true },
        { entityId: 102, entityName: 'Loan', approved: true },
      ]
    }

    component.rowData = [
      { entityId: 101, entityName: 'EFP', approved: false },
      { entityId: 102, entityName: 'Loan', approved: false },
      { entityId: 103, entityName: 'EFP', approved: false }
    ]
    component.selectedRows = [
      { entityId: 101, entityName: 'EFP', approved: false },
      { entityId: 102, entityName: 'Loan', approved: false },
    ]
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011'
    }
    let mockSelectedFiling = {
      "entityIds": [101, 102],
      "filingName": "FDI",
      "period": "2011",
      "stage": "Client review"
    }
    spyOn(component['service'], 'approvefilingEntities').and.callFake(() => {
      return of(mockResp);
    });
    spyOn(component, 'createEntitiesRowData');
    spyOn(component['filingService'], 'invokeFilingDetails')
    component.onSubmitApproveFilingEntities();
    expect(component['service'].approvefilingEntities).toHaveBeenCalledWith(mockSelectedFiling);
    expect(component.rowData).toEqual([
      { entityId: 101, entityName: 'EFP', approved: true },
      { entityId: 102, entityName: 'Loan', approved: true },
      { entityId: 103, entityName: 'EFP', approved: false }
    ]);
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component['filingService'].invokeFilingDetails).toHaveBeenCalled();
    expect(component.showToastAfterApproveFilingEntities).toEqual(true);
    tick(5000);
    expect(component.showToastAfterApproveFilingEntities).toEqual(false);
  }))

  it('onSubmitApproveExceptionReports method should submit approved exception reports', fakeAsync(() => {
    let mockResp = {
      data: {
        answerExceptions: [
          { exceptionId: 101, approved: true },
          { exceptionId: 102, approved: true },
        ]
      }
    }

    component.exceptionData = [
      { exceptionId: 101, approved: false },
      { exceptionId: 102, approved: false },
      { exceptionId: 103, approved: false }
    ]
    component.exceptionReportRows = [
      { exceptionId: 101, approved: false },
      { exceptionId: 102, approved: false },
    ]
    component.filingDetails = {
      filingName: 'FDI',
      period: '2011'
    }
    let mockSelectedReports = {
      "exceptionReportIds": [101, 102],
      "filingName": "FDI",
      "period": "2011",
      "stage": "Client review"
    }
    spyOn(component['service'], 'approveAnswerExceptions').and.callFake(() => {
      return of(mockResp);
    });
    spyOn(component, 'createEntitiesRowData');
    spyOn(component['filingService'], 'invokeFilingDetails')
    component.onSubmitApproveExceptionReports();
    expect(component['service'].approveAnswerExceptions).toHaveBeenCalledWith(mockSelectedReports);
    expect(component.exceptionData).toEqual([
      { exceptionId: 101, approved: true },
      { exceptionId: 102, approved: true },
      { exceptionId: 103, approved: false }
    ]);
    expect(component.createEntitiesRowData).toHaveBeenCalled();
    expect(component['filingService'].invokeFilingDetails).toHaveBeenCalled();
    expect(component.showToastAfterApproveExceptionReports).toEqual(true);
    tick(5000);
    expect(component.showToastAfterApproveExceptionReports).toEqual(false);
  }));

  it('exceptionReportRowsSelected method should add selected rows to exceptionReportRows ', () => {
    let mockSelectedRows = [
      { exceptionId: 101, approved: false },
      { exceptionId: 102, approved: false },
    ];

    component.exceptionReportRowsSelected(mockSelectedRows);
    expect(component.exceptionReportRows).toEqual([
      { exceptionId: 101, approved: false },
      { exceptionId: 102, approved: false },
    ])
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
    ])
  });

  it('onClickMyTask method should add exception data if myTask is true', () => {
    component.exceptionDataForFilter = [
      { name: 'FDI', mytask: true },
      { name: 'Loan', mytask: false }
    ]
    component.onClickMyTask(true);
    expect(component.exceptionData).toEqual([
      { name: 'FDI', mytask: true }
    ])
  })


  it('onClickMyTask method should add exception data if myTask is false', () => {
    component.exceptionDataForFilter = [
      { name: 'FDI', mytask: true },
      { name: 'Loan', mytask: false }
    ]
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
    expect(component.commentEntityType).toEqual('FILING_ENTITY')
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
    expect(component.commentEntityType).toEqual('ANSWER_EXCEPTION_REPORT')
    expect(component.entityId).toEqual('101')
    expect(component.showComments).toEqual(true)
  });

  it('actionMenuEnableforEntity method should enable action menu for entities', fakeAsync(() => {
    let row = {
      entityId: '101'
    };
    component.actionMenuEnableforEntity(row);
    expect(component.selectedEntityId).toEqual('101')
    tick(1)
    expect(component.actionMenuModalEnabled).toEqual(true)
    expect(component.actionMenuModal).toEqual(true)
  }));

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
    expect(component['router'].navigate).toHaveBeenCalledWith(['/view-exception-reports']);
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

  it('unApproveException method should open unapprove exception modal',fakeAsync(()=>{
    let mockResult = {
      button: 'Continue'
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }
    component.filingDetails = {
      filingName : 'FDI',
      period:'2011'
    }

    component.exceptionData = [
      {exceptionId :'101',approved:true}
    ]
    let mockResp = {
      data :[
        {entityId:'101'}
      ]
    }


    spyOn(component['service'],'unApproveAnswerExceptions').and.callFake(()=>{
      return of(mockResp)
    })
    spyOn(component['dialog'],'open').and.returnValue(mockData as any);
    component.unApproveException();
    expect(component.actionMenuModal).toEqual(false);
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.exceptionData).toEqual([{exceptionId :'101',approved:false}])
    expect(component.showToastAfterUnApproveFilings).toEqual(true);
    tick(5000);
    expect(component.showToastAfterUnApproveFilings).toEqual(false);
  }))

  it('unApproveEntity method should open unapprove exception modal',fakeAsync(()=>{
    let mockResult = {
      button: 'Continue'
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }
    component.filingDetails = {
      filingName : 'FDI',
      period:'2011'
    }

    component.rowData = [
      {entityId  :'101',approved:true,reviewLevel:'client'}
    ]
    let mockResp = {
      data :[
        {entityId:'101',reviewLevel:'client L1'}
      ]
    }


    spyOn(component['service'],'unApprovefilingEntities').and.callFake(()=>{
      return of(mockResp)
    })
    spyOn(component['dialog'],'open').and.returnValue(mockData as any);
    component.unApproveEntity();
    expect(component.actionMenuModal).toEqual(false);
    expect(component['dialog'].open).toHaveBeenCalled();
    expect(component.rowData).toEqual([{entityId :'101',approved:false,reviewLevel:'client L1'}])
    expect(component.showToastAfterUnApproveFilings).toEqual(true);
    tick(5000);
    expect(component.showToastAfterUnApproveFilings).toEqual(false);
  }))

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

    component.rowData = [{entityId :'101',commentsCount:0}]
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
});
