import { TestBed } from '@angular/core/testing';

import { ProcessingExceptionService } from './processing-exception.service';

describe('ProcessingExceptionService', () => {
  let service: ProcessingExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessingExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
