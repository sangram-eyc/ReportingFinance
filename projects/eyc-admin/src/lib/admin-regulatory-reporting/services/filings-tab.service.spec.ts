import { TestBed } from '@angular/core/testing';

import { FilingsTabService } from './filings-tab.service';

describe('FilingsTabService', () => {
  let service: FilingsTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilingsTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
