import { TestBed } from '@angular/core/testing';

import { EycRrSettingsService } from './eyc-rr-settings.service';
import { environment } from '../../../../../src/environments/environment';
describe('EycRrSettingsService', () => {
  let service: EycRrSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint}]
    });
    service = TestBed.inject(EycRrSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
