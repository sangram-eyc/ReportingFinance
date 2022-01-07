import { TestBed } from '@angular/core/testing';

import { UpdateFilingService } from './update-filing.service';

describe('UpdateFilingService', () => {
  let service: UpdateFilingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateFilingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
