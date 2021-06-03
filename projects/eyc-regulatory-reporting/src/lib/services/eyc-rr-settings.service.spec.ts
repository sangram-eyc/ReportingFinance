import { TestBed } from '@angular/core/testing';

import { EycRrSettingsService } from './eyc-rr-settings.service';
import { environment } from '../../../../../src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('EycRrSettingsService', () => {
  let service: EycRrSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(EycRrSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
