import { TestBed } from '@angular/core/testing';

import { DataManagedSettingsService } from './data-managed-settings.service';

describe('DataManagedSettingsService', () => {
  let service: DataManagedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataManagedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
