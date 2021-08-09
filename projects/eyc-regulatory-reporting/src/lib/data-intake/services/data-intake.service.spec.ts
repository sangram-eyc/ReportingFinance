import { TestBed } from '@angular/core/testing';

import { DataIntakeService } from './data-intake.service';

describe('DataIntakeService', () => {
  let service: DataIntakeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
