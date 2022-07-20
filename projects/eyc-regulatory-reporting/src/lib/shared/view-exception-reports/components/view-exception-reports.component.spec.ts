import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { ViewExceptionReportsService } from '../services/view-exception-reports.service';

import { ViewExceptionReportsComponent } from './view-exception-reports.component';

describe('ViewExceptionReportsComponent', () => {
  let component: ViewExceptionReportsComponent;
  let fixture: ComponentFixture<ViewExceptionReportsComponent>;
  let viewExceptionServiceStub = {
    getAnswerExceptionReports :()=>{
      let resp = {
        data : {
          exceptionResultJason :{}
        }
      }
      return of(resp)
    },
    getExceptionResults:()=>{
     return of({})
    }
  };

  let regulatoryReportingFilingServiceStub = {
    getExceptionData: () => { 
      return of({})
    },
    getFilingData :()=>{
      return of({})
    }
  };

  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }

    }
  }

  let routerStub = {
    getCurrentNavigation : ()=>{
      return {
        extras : {}
      }
    }
    }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExceptionReportsComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: RegulatoryReportingFilingService, useValue: regulatoryReportingFilingServiceStub },
        { provide: ViewExceptionReportsService, useValue: viewExceptionServiceStub },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: Router, useValue:routerStub},
        { provide: Location, useValue:{}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExceptionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit method should set data and period',()=>{
    component.dataIntakeData = {
      exceptionReportName:'PF Report',
      filingId:'101',
      dueDate:'10/02/2022',
      period:'Jan 2022',
      filingName:'PF Loan',
      parentModule:'Regulatory Reporting'
    }
    component.ngOnInit();
    expect(component.period).toEqual('Jan 2022')
  })

  it('getExceptionResults method should fetch exception results',()=>{
    component.dataIntakeData = {
      ruleExceptionId:'101'
    }
    let mockResp = {
      data : [{
        name:'PF'
      }]
    }
    spyOn(component['viewService'],'getExceptionResults').and.callFake(()=>{
      return of(mockResp)
    });
    spyOn(component,'createEntitiesRowData');
    component.getExceptionResults();
    expect(component['viewService'].getExceptionResults).toHaveBeenCalledWith('101','','','');
    expect(component.createEntitiesRowData).toHaveBeenCalled();
  });

  it('formatDate method should return formatted date',()=>{
    component.dueDate = '10 Jan 2022'
    component.formatDate();
    expect(component.dueDate).toEqual("01/10/2022")
  });

  it('addCommentToException method should open modal and add comment for execption',()=>{
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
    spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    component.addCommentToException({AuditResultObjectID:''})

  })

  it('openComments method should open comment modal',()=>{
    component.filingName = 'PF';
    component.period = "March 2022";
    component.openComments({AuditResultObjectID:'101'});
    expect(component.showComments).toEqual(true);
  })

  it('commentAdded method should call getAnswerExceptionReports method',()=>{
    spyOn(component,'getAnswerExceptionReports');
    component.commentAdded();
    expect(component.getAnswerExceptionReports).toHaveBeenCalled()
  })

  it('actionResolvedClick method should open modal and add comment for resolve execption',()=>{
    let mockResult = {
      button : 'Confirm',
      data :{
        assignTo:'abcd',
        comment:'',
        files:''
      }
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }
    //component.exceptionAnswersData = [{ AuditResultObjectID : '272',Status:'Unresolved'}]
    spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    component.actionResolvedClick({AuditResultObjectID:'272'})
    //expect(component.exceptionAnswersData).toEqual([{ AuditResultObjectID : '272',Status:'Resolved'}])
  });

  it('actionUnResolvedClick method should open modal and add comment for unresolve execption',()=>{
    let mockResult = {
      button : 'Confirm',
      data :{
        assignTo:'abcd',
        comment:'',
        files:''
      }
    }
    let mockData = {
      afterClosed : ()=> of(mockResult)
    }
   component.exceptionAnswersData = [{ AuditResultObjectID : '272',Status:'Resolved'}]
   spyOn(component.dialog, 'open').and.returnValue(mockData as any);
    component.actionUnResolvedClick({AuditResultObjectID:'272'})
    //expect(component.exceptionAnswersData).toEqual([{ AuditResultObjectID : '272',Status:'Unresolved'}])
  })
});

