import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import {BulkDownloadService} from './bulk-download.service';

describe('BulkDownloadService', () => {
  let service: BulkDownloadService;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
      bulk_download_service1: '/downloads'
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
    service = TestBed.inject(BulkDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('bulkDownloadFirstCall method should call api and fetch exception', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] })
    });
    service.bulkDownloadFirstCall({});
    let url = '/downloads';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});