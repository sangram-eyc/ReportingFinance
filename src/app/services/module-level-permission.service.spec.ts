import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { of } from 'rxjs';

import { ModuleLevelPermissionService } from './module-level-permission.service';

describe('ModuleLevelPermissionService', () => {
  let service: ModuleLevelPermissionService;
  let routerStub = {
    navigate : () => {}
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientModule,HttpClientTestingModule],
      providers:[OAuthService, UrlHelperService, OAuthLogger,
                { provide: Router, useValue: routerStub}]
    });
    service = TestBed.inject(ModuleLevelPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getModuleLevelPermission method should return module level permission',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of([])
    });

    service.getModuleLevelPermission();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalled()
  });

  it('invokeModulePermissionDetails method should emit permission details',()=>{
    spyOn(service['moduleLevelPermisssionDetails'],'emit');
    service.invokeModulePermissionDetails({});
    expect(service['moduleLevelPermisssionDetails'].emit).toHaveBeenCalledWith(null);
  });


  it('getPermissionsList method should return permission list',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of([])
    });

    service.getPermissionsList();
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalled()
  });


  it('checkPermission method should check and return true for All modules',()=>{
    let mockData = {
      userModules : {
        All:'all',
      }
    }

    spyOn(sessionStorage,'getItem').and.returnValue(JSON.stringify(mockData));
    let res = service.checkPermission('regulatory-reporting');
    expect(sessionStorage.getItem).toHaveBeenCalled();
    expect(res).toEqual(true)
  })

  it('checkPermission method should check and return true',()=>{
    let mockData = {
      userModules : {
        'regulatory-reporting':'regulatory-reporting',
      }
    }
    spyOn(sessionStorage,'getItem').and.returnValue(JSON.stringify(mockData));
    let res = service.checkPermission('regulatory-reporting');
    expect(sessionStorage.getItem).toHaveBeenCalled();
    expect(res).toEqual(true);
  })

  it('checkPermission method should logoff and return false',()=>{
    spyOn(sessionStorage,'getItem').and.returnValue(JSON.stringify(''));
    let res = service.checkPermission('regulatory-reporting');
    expect(sessionStorage.getItem).toHaveBeenCalled();
    expect(res).toEqual(false);
  })

});
