import { TestBed } from '@angular/core/testing';

import { EuropeanFundReportingSettingsService } from './european-fund-reporting-settings.service';

describe('EuropeanFundReportingSettingsService', () => {
  let service: EuropeanFundReportingSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EuropeanFundReportingSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
