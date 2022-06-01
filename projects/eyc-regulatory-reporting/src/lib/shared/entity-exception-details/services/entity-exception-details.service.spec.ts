import { TestBed } from '@angular/core/testing';

import { EntityExceptionDetailsService } from './entity-exception-details.service';

describe('EntityExceptionDetailsService', () => {
  let service: EntityExceptionDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityExceptionDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
