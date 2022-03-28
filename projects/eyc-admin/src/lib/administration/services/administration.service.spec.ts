import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {
  let service: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,HttpClientModule]
    });
    service = TestBed.inject(AdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPermissionsList method should permission list',()=>{
    let url = `http://localhost:4200/assets/mock/reg_reporting_permissions.json?module=Admin`
    spyOn(service['apiService'],'invokeGetAPI');
    service.getPermissionsList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  });
});
