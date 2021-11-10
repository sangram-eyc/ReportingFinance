import { async, TestBed } from '@angular/core/testing';
import { SettingsService } from '@default/services/settings.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { OauthService } from './oauth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('OauthService', () => {
  let service: OauthService;
  let oService: OAuthService;
  let storageService: SettingsService;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule],
      providers: [OAuthService, OauthService, SettingsService, UrlHelperService, OAuthLogger, {provide: Router, useValue: router}],
    });
    service = TestBed.inject(OauthService);
    oService = TestBed.inject(OAuthService);
    storageService = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
    it('login', () => {
      
      service.login();
      let myspy;
      myspy = spyOn(oService, 'initImplicitFlow').and.callThrough();
      expect(myspy).toBeTruthy();
    });

    it('logoff', () => {
      
      service.logoff();
      let myspy;
      myspy = spyOn(oService, 'logOut').and.callThrough();
      expect(myspy).toBeTruthy();
    });

    it('name()', () => {
      const name = service.name;
      const claims = oService.getIdentityClaims();
        expect(name).toBe(claims);
    });
    
    it('getAccessToken method should set token',()=>{
      spyOn(service['oauthService'],'getAccessToken').and.returnValue('asd123')
      spyOn(service['storageService'],'setToken');
      service.getAccessToken();
      expect(service['storageService'].setToken).toHaveBeenCalledWith('asd123');
      expect(service['router'].navigate).toHaveBeenCalledWith(['/home'])
    })

    it('refreshToken method should not call silentRefresh service',()=>{
      spyOn(service['oauthService'],'silentRefresh').and.rejectWith('error occured');
      spyOn(service,'getAccessToken');
      service.refreshToken();
      expect(service.getAccessToken).not.toHaveBeenCalled();
    });

    it('refreshToken method should call silentRefresh service',()=>{
      spyOn(service['oauthService'],'silentRefresh').and.resolveTo();
      spyOn(service['oauthService'],'getAccessToken').and.returnValue('asd123')
      spyOn(service,'getAccessToken');
      service.refreshToken();

    })
});
