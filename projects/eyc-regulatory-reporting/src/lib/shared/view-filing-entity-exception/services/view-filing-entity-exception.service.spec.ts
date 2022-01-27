import { TestBed } from '@angular/core/testing';

import { ViewFilingEntityExceptionService } from './view-filing-entity-exception.service';

describe('ViewFilingEntityExceptionService', () => {
  let service: ViewFilingEntityExceptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewFilingEntityExceptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
