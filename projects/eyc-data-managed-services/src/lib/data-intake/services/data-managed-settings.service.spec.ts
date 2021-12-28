import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { DataManagedSettingsService } from './data-managed-settings.service';

describe('DataManagedSettingsService', () => {
  let service: DataManagedSettingsService;

 beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [{provide:"dataManagedEndPoint",  useValue: environment.apiEndpoint},
      {provide:"dataManagedProduction",  useValue: environment.production}]
    });
    service = TestBed.inject(DataManagedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set services to dmsdataintakeservice url if dataManagedProduction', () => {
    const testComponent = new DataManagedSettingsService(true,'http://localhost:4200/');
    expect(testComponent.production).toBeTruthy();

    expect(testComponent.dataManagedServices.file_summary_list).toContain('dmsdataintakeservice/api/v2/dms/data-summary');
    expect(testComponent.dataManagedServices.file_summary_list_daily).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_summary_list_monthly).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_data_provider).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_data_provider_daily).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_data_provider_monthly).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_data_domain_daily).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_data_domain_monthly).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_general_ledger_daily).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_general_ledger).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.exception_reports_table).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_review_data).toContain('dmsdataintakeservice/api/v2/dms/');
    expect(testComponent.dataManagedServices.file_review_table_data ).toContain('dmsdataintakeservice/api/v2/dms/');
  });
});
