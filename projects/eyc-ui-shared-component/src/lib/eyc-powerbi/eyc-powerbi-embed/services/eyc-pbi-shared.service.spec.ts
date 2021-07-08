import { TestBed } from '@angular/core/testing';

import { EycPbiSharedService } from './eyc-pbi-shared.service';

describe('EycPbiSharedService', () => {
  let service: EycPbiSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycPbiSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
