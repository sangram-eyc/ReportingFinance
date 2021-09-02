import { TestBed } from '@angular/core/testing';

import { ViewExceptionReportsService } from './view-exception-reports.service';

describe('ViewExceptionReportsService', () => {
  let service: ViewExceptionReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewExceptionReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
