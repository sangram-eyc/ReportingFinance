import { TestBed } from '@angular/core/testing';

import { EycRrApiService } from './eyc-rr-api.service';

describe('EycRrApiService', () => {
  let service: EycRrApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycRrApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
