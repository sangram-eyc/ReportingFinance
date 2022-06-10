import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import {ManagementReportsService } from './management-reports.service';

describe('ManagementReportsService', () => {
  let service: ManagementReportsService;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
      management_report: '/managementReports/'
    }
  }
  let eycTaxReportingApiServiceStub = {
    invokeGetAPI: () => { },
    invokePutAPI: () => { },
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
          {provide:EycApiService, useValue:  eycTaxReportingApiServiceStub},
          {provide:EycTaxSettingsService, useValue:eycTaxSettingsServiceStub},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(ManagementReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('reportsData method should call api and fetch exception', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.reportsData();
    let url = '/managementReports/';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});