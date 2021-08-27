import { TestBed } from '@angular/core/testing';

import { ModuleLevelPermissionService } from './module-level-permission.service';

describe('ModuleLevelPermissionService', () => {
  let service: ModuleLevelPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuleLevelPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
