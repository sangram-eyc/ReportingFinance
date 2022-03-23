import { TestBed } from '@angular/core/testing';

import { EycExpenseReportingService } from './eyc-expense-reporting.service';

describe('EycExpenseReportingService', () => {
  let service: EycExpenseReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycExpenseReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
