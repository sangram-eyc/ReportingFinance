import { TestBed } from '@angular/core/testing';

import { CustomGlobalService } from './custom-global.service';

describe('CustomGlobalService', () => {
  let service: CustomGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
