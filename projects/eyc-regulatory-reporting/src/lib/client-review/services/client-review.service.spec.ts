import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { ClientReviewService } from './client-review.service';

describe('ClientReviewService', () => {
  let service: ClientReviewService;
  let eycRrSettingsServiceStub = {
    regReportingFiling: {
      rr_exception_reports: '/rr_exception_reports/',
      client_review_filing_entities: '/client_review_filing_entities/',
      approve_client_review_filing_entities: '/approve_client_review_filing_entities/',
      filing_unapprove: '/filing_unapprove/',
      approve_answer_exceptions: '/approve_answer_exceptions/',
      rr_comments: '/rr_comments/'
    }
  }
  let eycRrApiServiceStub = {
    invokeGetAPI: () => { },
    invokePutAPI: () => { },
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: EycRrApiService, useValue: eycRrApiServiceStub }]
    });
    service = TestBed.inject(ClientReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExceptionReports method should call api and fetch exception reports list', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getExceptionReports('FDI', '2011', 'Client review');
    let url = "/rr_exception_reports/&filingName=FDI&period=2011&stage=Client review";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('getfilingEntities method should call api and fetch filing Entities', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getfilingEntities('FDI', '2011');
    let url = "/client_review_filing_entities/&filingName=FDI&period=2011";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('approvefilingEntities method should call api and approve filing Entity', () => {
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(() => {
      return of({ data: [] })
    });
    let mockData = {
      filingName: 'FDI',
      entityId: '1011'
    }
    service.approvefilingEntities(mockData);
    let url = "/approve_client_review_filing_entities/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url, mockData);
  });

  it('unApprovefilingEntities method should call api and unapprove filing Entity', () => {
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(() => {
      return of({ data: [] })
    });
    let mockData = {
      filingName: 'FDI',
      entityId: '1011'
    }
    service.unApprovefilingEntities(mockData);
    let url = "/filing_unapprove/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url, mockData);
  });

  it('approveAnswerExceptions method should call api and approve exception report', () => {
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(() => {
      return of({ data: [] })
    });
    let mockData = {
      exceptionReportName: 'FDI',
      exceptionId: '1011'
    }
    service.approveAnswerExceptions(mockData);
    let url = "/approve_answer_exceptions/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url, mockData);
  });

  it('unApproveAnswerExceptions method should call api and unapprove exception report', () => {
    spyOn(service['apiService'], 'invokePutAPI').and.callFake(() => {
      return of({ data: [] })
    });
    let mockData = {
      exceptionReportName: 'FDI',
      exceptionId: '1011'
    }
    service.unApproveAnswerExceptions(mockData);
    let url = "/filing_unapprove/";
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith(url, mockData);
  });

  it('getComments method should call api and fetch exception reports list', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getComments('filing', '1011');
    let url = "/rr_comments/";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});
