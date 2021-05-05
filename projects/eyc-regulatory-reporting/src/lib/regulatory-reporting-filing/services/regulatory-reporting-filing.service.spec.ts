import { TestBed } from '@angular/core/testing';

import { RegulatoryReportingFilingService } from './regulatory-reporting-filing.service';

describe('RegulatoryReportingFilingService', () => {
  let service: RegulatoryReportingFilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegulatoryReportingFilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
