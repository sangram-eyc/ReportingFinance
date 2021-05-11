import { TestBed } from '@angular/core/testing';

import { EycRrSettingsService } from './eyc-rr-settings.service';

describe('EycRrSettingsService', () => {
  let service: EycRrSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycRrSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
