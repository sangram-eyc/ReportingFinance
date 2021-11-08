import { async, inject, TestBed } from '@angular/core/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { SettingsService } from './settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ID_ENCRYPTION_KEY, SESSION_ACCESS_TOKEN, SESSION_ENCRYPTION_KEY, SESSION_ID_TOKEN } from './settings-helpers';
import * as CryptoJS from 'crypto-js';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OAuthService, UrlHelperService, OAuthLogger],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('setToken()', () => {
    let value = "dfvdfvdvdfvdfvdd";
    spyOn(sessionStorage,'setItem')
    service.setToken(value)
    expect(sessionStorage.setItem).toHaveBeenCalled()
  });


  it('getToken()', () => {
    let returndID
    sessionStorage.setItem("access_token", "afssdssfcsdc")
    const getDecryptedText = sessionStorage.getItem(SESSION_ACCESS_TOKEN);
    const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
    if (getDecryptedText != null) {
      var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      returndID =  decrypted.toString(CryptoJS.enc.Utf8);
    }
    let getToken = service.getToken()
    expect(getToken).toBe(returndID);
  });

  it('setIdToken in sessions storage', () => {
    let value = "dfvdfvdvdfvdfvdd";
    spyOn(sessionStorage,'setItem')

    let val = `n2LTsKyeP/HTjpb928bdGAxSokxbW2NpewnSXcGXkmTc=` ;
    service.setIdToken(value);
    expect(sessionStorage.setItem).toHaveBeenCalled()
  });



  it('getIdToken()', () => {
    let returndID
    sessionStorage.setItem("id_token", "afssdssfcsdc")
    const getDecryptedText = sessionStorage.getItem(SESSION_ID_TOKEN);
    const key = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
    if (getDecryptedText != null) {
      var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      returndID =  decrypted.toString(CryptoJS.enc.Utf8);
    }
    let getIdToken = service.getIdToken()
    expect(getIdToken).toBe(returndID);
  });


  it('should logout user', () => {
    service.logoff();
    expect(sessionStorage.getItem('currentUserSession')).toBeNull();
    expect(sessionStorage.getItem('session')).toBeNull();
  });


  it('name()', inject([OAuthService], (oauthService) => {
    const name = service.name;
    const claims = oauthService.getIdentityClaims();
      expect(name).toBe(claims);
  }));

  it('cancelPendingRequests()', () => {
    const nextSpy = spyOn((service as any).pendingHTTPRequests$, 'next');
    service.cancelPendingRequests();
    expect(nextSpy).toHaveBeenCalled();
});

it('loadAuthDetails should return a resolved Promise', ()=>{
  service.loadAuthDetails().then((value) => {
    expect(value).toBe(true);
  });
});

it('onCancelPendingRequests should',()=>{
  spyOn(service['pendingHTTPRequests$'],'asObservable');
  service.onCancelPendingRequests();
  expect(service['pendingHTTPRequests$'].asObservable).toHaveBeenCalled()

});



it('isUserLoggedin method should return true if user is logged in', () => {
  spyOn(sessionStorage,'getItem').and.returnValue('123qwe');
  let res= service.isUserLoggedin();
  expect(res).toEqual(true)
 });

 it('isUserLoggedin should return false if user not logged in', () => {
  spyOn(sessionStorage,'getItem').and.returnValue(null);
  let res= service.isUserLoggedin();
  expect(res).toEqual(false)
 });

 it('loadAuthDetails should return a resolved Promise and set auth details ', ()=>{
   let mockData = {
     data : {
      authenticationUrl :'',
      logoutUrl:''
     }
   }
  spyOn(service['http'],'get').and.returnValue(of(mockData))
  service.loadAuthDetails().then((value) => {
    expect(value).toBe(true);
  });

});
});