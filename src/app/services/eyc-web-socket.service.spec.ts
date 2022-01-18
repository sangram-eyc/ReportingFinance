import { TestBed } from '@angular/core/testing';

import { EycWebSocketService } from './eyc-web-socket.service';

describe('EycWebSocketService', () => {
  let service: EycWebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycWebSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
