import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { ArchivedReportsService } from './archived-reports.service';

describe('ArchivedReportsService', () => {
  let service: ArchivedReportsService;
  let eycTaxSettingsServiceStub = {
    taxReporting: {
      archived_reports: '/archived-production-cycles',
    },
  };
  let eycTaxReportingApiServiceStub = {
    invokeGetAPI: () => {},
    invokePutAPI: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        ArchivedReportsService,
        { provide: EycApiService, useValue: eycTaxReportingApiServiceStub },
        { provide: EycTaxSettingsService, useValue: eycTaxSettingsServiceStub },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: 'rrproduction', useValue: environment.production },
      ],
    });
    service = TestBed.inject(ArchivedReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getArchivedReportsData method should call api and fetch exception', () => {
    spyOn(service['apiService'], 'invokeGetAPI').and.callFake(() => {
      return of({ data: [] });
    });
    service.getArchivedReportsData();
    let url = '/archived-production-cycles';
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});
