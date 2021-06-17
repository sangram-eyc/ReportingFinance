import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { FundScopingService } from './fund-scoping.service';

describe('FundScopingService', () => {
  let service: FundScopingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(FundScopingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});