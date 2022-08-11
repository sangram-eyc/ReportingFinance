import { TestBed } from '@angular/core/testing';

import { IntakeRoutingStateService } from './routing-state.service';

describe('RoutingStateService', () => {
  let service: IntakeRoutingStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntakeRoutingStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
