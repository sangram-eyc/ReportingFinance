import { TestBed } from '@angular/core/testing';

import { EycSseService } from './eyc-sse.service';

describe('EycSseService', () => {
  let service: EycSseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycSseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
