import { TestBed } from '@angular/core/testing';

import { DataIntakeLandingService } from './data-intake-landing.service';

describe('DataIntakeLandingService', () => {
  let service: DataIntakeLandingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataIntakeLandingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
