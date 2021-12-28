import { TestBed } from '@angular/core/testing';

import { AutoUnsubscriberService } from './auto-unsubscriber.service';

describe('AutoUnsubscriberService', () => {
  let service: AutoUnsubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoUnsubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
