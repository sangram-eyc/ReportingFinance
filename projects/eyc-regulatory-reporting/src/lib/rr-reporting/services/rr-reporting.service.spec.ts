import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { RrReportingService } from './rr-reporting.service';

describe('RrReportingService', () => {
  let service: RrReportingService;

  let eycRrSettingsServiceStub = {
    regReportingFiling : {
      rr_exception_reports:'/rr_exception_reports/',
      rr_filing_entities:'/rr_filing_entities/',
      approve_rr_filing_entities:'/approve_rr_filing_entities/',
      filing_unapprove:"/filing_unapprove/",
      approve_answer_exceptions:'/approve_answer_exceptions/',
      rr_comments:'/rr_comments/',
      audit_log:'/audit_log/'
    }
  }
  let eycRrApiServiceStub = {
    invokeGetAPI : ()=>{},
    invokePutAPI: () =>{}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService,
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: EycRrApiService, useValue: eycRrApiServiceStub }]
    });
    service = TestBed.inject(RrReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExceptionReports method should call api and fetch exception reports list', () => {
    let mockResp = {
      data :[
        {
          approved:true,
          exceptionId:1011,
          exceptionName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.getExceptionReports('Form PF', 'Q1 2022', 'Reporting');
    let url = "/rr_exception_reports/filingName=Form PF&period=Q1 2022&stage=Reporting&page=1&size=10&filterKey=&sortBy=exceptionId";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('getfilingEntities method should call api and fetch filling entities', () => {
    let mockResp = {
      data :[
        {
          approved:true,
          entityId:1011,
          entityName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.getfilingEntities('Form PF', 'Q1 2022');
    let url = "/rr_filing_entities/&filingName=Form PF&period=Q1 2022&page=1&size=10&filterKey=&sortBy=entityId";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('approvefilingEntities method should call api and approve filling entities', () => {

    let mockData = {
      data :[
        {
          approved:false,
          entityId:1011,
          entityName:'Goldman sachs'
        }
      ]
    }
    let mockResp = {
      data :[
        {
          approved:true,
          entityId:1011,
          entityName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.approvefilingEntities(mockData);
    let url = "/approve_rr_filing_entities/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockData);
  });

  it('unApprovefilingEntities method should call api and unapprove filling entities', () => {
    let mockData = {
      data :[
        {
          approved:true,
          entityId:1011,
          entityName:'Goldman sachs'
        }
      ]
    }
    let mockResp = {
      data :[
        {
          approved:false,
          entityId:1011,
          entityName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.unApprovefilingEntities(mockData);
    let url = "/filing_unapprove/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockData);
  });

  it('approveAnswerExceptions method should call api and approve answer exceptions', () => {
    let mockData = {
      data :[
        {
          approved:false,
          exceptionId:1011,
          exceptionName:'Goldman sachs'
        }
      ]
    }
    let mockResp = {
      data :[
        {
          approved:true,
          exceptionId:1011,
          exceptionName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.approveAnswerExceptions(mockData);
    let url = "/approve_answer_exceptions/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockData);
  });

  it('unApproveAnswerExceptions method should call api and unapprove answer exceptions', () => {
    let mockData = {
      data :[
        {
          approved:true,
          exceptionId:1011,
          exceptionName:'Goldman sachs'
        }
      ]
    }
    let mockResp = {
      data :[
        {
          approved:false,
          exceptionId:1011,
          exceptionName:'Goldman sachs'
        }
      ]
    }
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(()=>{
      return of(mockResp)
    });
    service.unApproveAnswerExceptions(mockData);
    let url = "/filing_unapprove/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url,mockData);
  });

  it('getComments method should call api and fetch comments', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of({})
    });
    service.getComments('entity',10998);
    let url = "/rr_comments/";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('exportRRData method should call api and fetch export data', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of({})
    });
    service.exportRRData('/exportData');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exportData');
  });

  it('exportRRData method should call api and fetch export data', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of({})
    });
    service.exportRRData('/exportData');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exportData');
  });

  it('getAuditlog method should call api and fetch audit log data', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(()=>{
      return of({})
    });
    service.getAuditlog(45141,'mockType');
    let URL ="/audit_log/?auditObjectId=45141&auditObjectType=mockType&fetchDetails=true"
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(URL);
  });

});
