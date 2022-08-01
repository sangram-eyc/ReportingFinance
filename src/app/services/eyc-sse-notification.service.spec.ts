import { TestBed } from '@angular/core/testing';

import { EycSseNotificationService } from './eyc-sse-notification.service';

describe('EycSseNotificationService', () => {
  let service: EycSseNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycSseNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
