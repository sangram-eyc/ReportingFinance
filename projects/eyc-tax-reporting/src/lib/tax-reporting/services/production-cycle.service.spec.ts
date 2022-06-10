import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { ManagementReportsService } from './management-reports.service';
import { ProductionCycleService } from './production-cycle.service';

describe('ProductionCyclesService', () => {
  let service: ProductionCycleService;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
        production_cycles_details: '/production-cycles/',
        production_cycles: '/production-cycles/',
        production_cycles_statusTracker: '/production-cycles/',
        production_cycles_downloadFile: '/production-cycles/funds',
        production_cycles_approveEntities: '/production-cycles/funds/status'
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
    service = TestBed.inject(ProductionCycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getProductionCycles method should call api and fetch exception ProductionCycles', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getProductionCycles();
    let url = "/production-cycles/";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  it('getProductionCycleDetails method should call api and fetch exception ProductionCycleDetail', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getProductionCyclesDetails(1);
    let url = "/production-cycles/";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('getStatusTrackerLink method should call api and fetch exception getStatusTrackerLink', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getStatusTrackerLink(1);
    let url = "/production-cycles/";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('getDownloadFile method should call api and download the json file', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.getDownloadFile(1, 'ProductCycleDownloadFile.json');
    let url = "/production-cycles/funds";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });

  it('putApproveEntities method should call api and put json object', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.putApproveEntities({});
    let url = "/production-cycles/funds/status";
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
  
});