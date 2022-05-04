import { TestBed } from '@angular/core/testing';

import { EuropeanFundReportingApiService } from './european-fund-reporting-api.service';

describe('EuropeanFundReportingApiService', () => {
  let service: EuropeanFundReportingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuropeanFundReportingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
