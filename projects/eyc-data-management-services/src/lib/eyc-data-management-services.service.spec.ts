import { TestBed } from '@angular/core/testing';

import { EycDataManagementServicesService } from './eyc-data-management-services.service';

describe('EycDataManagementServicesService', () => {
  let service: EycDataManagementServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EycDataManagementServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
