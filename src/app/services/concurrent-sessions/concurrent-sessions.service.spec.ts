import { TestBed } from '@angular/core/testing';

import { ConcurrentSessionsService } from './concurrent-sessions.service';

describe('ConcurrentSessionService', () => {
  let service: ConcurrentSessionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcurrentSessionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
