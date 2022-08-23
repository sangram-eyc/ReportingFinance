import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';
import { DataGrid, ExceptionDataGrid, ExceptionDetailsDataGrid, GroupByDataProviderCardGrid } from '../models/data-grid.model';
import { DataSummary } from '../models/data-summary.model';

import { IntakeLandingService } from './intake-landing.service';
import { IntakeRoutingStateService } from './intake-routing-state.service';

describe('IntakeLandingService', () => {
  let service: IntakeLandingService;
  let eycRrSettingsServiceStub={
    regIntakeSumarry :{
      file_summary_list:'/file_summary_list',
      file_summary_review_all:'/file_summary_review_all',
      PBI_EMBED_URL:'/PBI_EMBED_URL',
      PBI_AUTH_TOKEN_URL:'/PBI_AUTH_TOKEN_URL',
      file_data_provider:'/file_data_provider',
      file_data_provider_daily:'/file_data_provider_daily',
      file_data_provider_monthly:'/file_data_provider_monthly',
      file_data_domain_daily:'/file_data_domain_daily',
      file_data_domain_monthly:'/file_data_domain_monthly',
      file_general_ledger_daily:'/file_general_ledger_daily',
      file_review_data:'/file_review_data',
      exception_reports_table:'/exception_reports_table',
      file_review_table_data:'/file_review_table_data',
      exception_table_data:'/exception_table_data',
      exception_details_table_data:'/exception_details_table_data',
      review_by_group_provider_domain:'/review_by_group_provider_domain',
      api_catalog:'/api_catalog'
    }
  };
  let eycRrApiServiceStub ={
    invokeGetAPI:()=>{},
    invokePostBodyAPI:()=>{},
    invokePostAPI:()=>{}
  };
  let intakeRoutingStateServiceStub={};
  let routerStub ={};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: EycRrApiService, useValue: eycRrApiServiceStub },
        { provide: IntakeRoutingStateService, useValue:intakeRoutingStateServiceStub},
        { provide: Router, useValue:routerStub}]
    });
    service = TestBed.inject(IntakeLandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getApiCatalog method should return catlog',()=>{
    spyOn(service['apiService'],'invokePostAPI');
    service.getApiCatalog();
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith('/api_catalog')
  })

  it('getApiBaseUrl method should return catlog',()=>{
    let res = service.getApiBaseUrl();
  })

  it("getReviewByGroupProviderOrDomainGrid method should ",()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getReviewByGroupProviderOrDomainGrid({} as GroupByDataProviderCardGrid);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/review_by_group_provider_domain')
  })

  it("getExceptionDetailsTableData method should ",()=>{
    spyOn(service['apiService'],'invokePostBodyAPI');
    service.getExceptionDetailsTableData({tableName:'test',auditDate:'01/03/22'} as ExceptionDetailsDataGrid,'');
    expect(service['apiService'].invokePostBodyAPI).toHaveBeenCalledWith('/exception_details_table_data?tableName=test&auditDate=01/03/22', '');
  })

  it('getExceptionTableData method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getExceptionTableData({} as ExceptionDataGrid);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exception_table_data')
  })

  it('getReviewFileTableData method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getReviewFileTableData({} as DataGrid);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_review_table_data')
  })

  it('getReviewFilesData method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getReviewFilesData();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_review_data')
  })

  it('getExceptionReportstable method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getExceptionReportstable();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exception_reports_table')
  })

  it('getMonthlyDataDomainList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getMonthlyDataDomainList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_domain_monthly')
  })

  it('getDailyDataDomainList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDailyDataDomainList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_domain_daily')
  })

  it('getMonthlyDataProviderList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getMonthlyDataProviderList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_provider_monthly')
  })

  it('getDailyDataProviderList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDailyDataProviderList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_provider_daily')
  })

  it('getDailyDataProviderList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDailyDataProviderList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_provider_daily')
  })

  it('getDataProviderList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDataProviderList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_data_provider')
  })

  it('getEmbedTokenURL method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getEmbedTokenURL();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/PBI_AUTH_TOKEN_URL')
  })

  it('getEmbedURL method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getEmbedURL();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/PBI_EMBED_URL')
  })

  it('getReviewAllList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getReviewAllList({} as DataSummary);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_summary_review_all')
  })

  it('getFileSummaryList method should return exception table data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getFileSummaryList({} as DataSummary);
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/file_summary_list')
  })

});
