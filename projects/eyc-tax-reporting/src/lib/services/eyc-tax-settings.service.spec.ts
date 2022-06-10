import { TestBed } from '@angular/core/testing';

import { EycTaxSettingsService } from './eyc-tax-settings.service';
import { environment } from '../../../../../src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { taxenvironment } from '../../../../../src/environments/eyc-tax-reporting/tax-environment';
describe('EycTaxSettingsService', () => {
  let service: EycTaxSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"rrproduction",  useValue: environment.production},
      {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
      {provide:"taxProduction",  useValue: taxenvironment.production},]
    });
    
    service = TestBed.inject(EycTaxSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
