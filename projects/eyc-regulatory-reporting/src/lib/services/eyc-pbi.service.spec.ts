import { TestBed } from '@angular/core/testing';

import { EycPbiService } from './eyc-pbi.service';

describe('EycPbiService', () => {
  let service: EycPbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycPbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
