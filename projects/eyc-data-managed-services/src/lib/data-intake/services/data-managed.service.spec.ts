import { TestBed } from '@angular/core/testing';

import { DataManagedService } from './data-managed.service';

describe('DataManagedService', () => {
  let service: DataManagedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataManagedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
