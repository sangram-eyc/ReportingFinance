import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import {TaxLoaderService } from './tax-loader.service';

describe('ManagementReportsService', () => {
  let service: TaxLoaderService;
  let isLoading = new Subject<boolean>();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: []
    });
    service = TestBed.inject(TaxLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('show method should set isLoading variable to true', () => {
    isLoading.next(true);
    service.show();
    expect(service.isLoading).toEqual(isLoading);
  });
  it('hide method should set isLoading variable to false', () => {
    isLoading.next(false);
    service.hide();
    expect(service.isLoading).toEqual(isLoading);
  });
});