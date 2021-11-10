import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { OauthService } from '@default/login/services/oauth.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  let routerStub = {
    navigate : () => {}
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule,HttpClientModule],
      providers : [OauthService,OAuthService,UrlHelperService,OAuthLogger,
        {provide: Router, useValue: routerStub}
      ]
    });
    service = TestBed.inject(AuthGuardService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('canActivate method should check user status and return true',()=>{
    let next:ActivatedRouteSnapshot;
    let state:RouterStateSnapshot;
    spyOn(service['settings'],'isUserLoggedin').and.returnValue(true)
    let res = service.canActivate(next,state);
    expect(res).toEqual(true);
  })

  it('canActivate method should check user status and return false',()=>{
    let next:ActivatedRouteSnapshot;
    let state:RouterStateSnapshot;
    spyOn(service['settings'],'isUserLoggedin').and.returnValue(false);
    spyOn(service['router'],'navigate');
    let res = service.canActivate(next,state);
    expect(service['router'].navigate).toHaveBeenCalledWith([''])
    expect(res).toEqual(false);
  })

  it('canActivateChild method should return true',()=>{
    let next:ActivatedRouteSnapshot;
    let state:RouterStateSnapshot;
    let res = service.canActivateChild(next,state);
    expect(res).toEqual(true)
  })
});
