import { TestBed } from '@angular/core/testing';

import { FilingEntityService } from './filing-entity.service';

describe('FilingEntityService', () => {
  let service: FilingEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilingEntityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
