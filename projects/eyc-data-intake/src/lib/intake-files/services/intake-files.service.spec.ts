import { TestBed } from '@angular/core/testing';

import { IntakeFilesService } from './intake-files.service';

describe('IntakeFilesService', () => {
  let service: IntakeFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntakeFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
