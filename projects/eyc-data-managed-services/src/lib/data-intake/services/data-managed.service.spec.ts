import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { datamanagedenvironment } from '../../../../../../src/environments/eyc-data-managed-services/data-managed-environment';
import { DataManagedSettingsService } from './data-managed-settings.service';

import { DataManagedService } from './data-managed.service';
import { EycDataApiService } from './eyc-data-api.service';

describe('DataManagedService', () => {
  let service: DataManagedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataManagedService, 
        DataManagedSettingsService,
        EycDataApiService,
        { provide: "dataManagedProduction", useValue: datamanagedenvironment.production },
        { provide: "dataManagedEndPoint", useValue: datamanagedenvironment.apiEndpoint }],
        imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DataManagedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
