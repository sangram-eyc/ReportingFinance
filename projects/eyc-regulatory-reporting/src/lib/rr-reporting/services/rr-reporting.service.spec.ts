import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { RrReportingService } from './rr-reporting.service';

describe('RrReportingService', () => {
  let service: RrReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint}]
    });
    service = TestBed.inject(RrReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
