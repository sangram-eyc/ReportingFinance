import { TestBed } from '@angular/core/testing';

import { DataExplorerService } from './data-explorer.service';

describe('DataExplorerService', () => {
  let service: DataExplorerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
