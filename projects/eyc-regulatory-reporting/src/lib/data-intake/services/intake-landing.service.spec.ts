import { TestBed } from '@angular/core/testing';

import { IntakeLandingService } from './intake-landing.service';

describe('IntakeLandingService', () => {
  let service: IntakeLandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntakeLandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
