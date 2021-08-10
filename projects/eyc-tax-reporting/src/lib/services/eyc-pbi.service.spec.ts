import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../src/environments/environment';

import { EycPbiService } from './eyc-pbi.service';
import { EycRrSettingsService } from './eyc-rr-settings.service';

describe('EycPbiService', () => {
  let service: EycPbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(EycPbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
