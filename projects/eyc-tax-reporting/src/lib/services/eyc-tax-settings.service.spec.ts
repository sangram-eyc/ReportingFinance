import { TestBed } from '@angular/core/testing';

import { EycTaxSettingsService } from './eyc-tax-settings.service';
import { environment } from '../../../../../src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('EycTaxSettingsService', () => {
  let service: EycTaxSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(EycTaxSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set services to gatewayService url if rrproduction', () => {
    const testComponent = new EycTaxSettingsService('http://localhost:4200/', true);
    expect(testComponent.production).toBeTruthy();
    expect(testComponent.regReportingFiling.filing_details).toContain('gatewayService/api/v2/regreporting/getFilingDetails?filter=active');
    expect(testComponent.pbiReportingConfig.question_details).toContain('gatewayService/api/v2/regreporting/getQuestionsByFilingId/');
  })
});