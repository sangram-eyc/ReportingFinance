import { inject, TestBed } from '@angular/core/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { SettingsService } from './settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ID_ENCRYPTION_KEY, SESSION_ACCESS_TOKEN, SESSION_ENCRYPTION_KEY, SESSION_ID_TOKEN } from './settings-helpers';
import * as CryptoJS from 'crypto-js';
describe('SettingsService', () => {
  let service: SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OAuthService, UrlHelperService, OAuthLogger]
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('setToken()', () => {
    let value = "dfvdfvdvdfvdfvdd"
    const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // sessionStorage.setItem(SESSION_ID_TOKEN,encrypted);
    service.setToken(value)
    expect(sessionStorage.getItem("access_token")).toEqual(encrypted.toString());
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


  it('setIdToken()', () => {
    let value = "dfvdfvdvdfvdfvdd"
    const key = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    // sessionStorage.setItem(SESSION_ID_TOKEN,encrypted);
    service.setIdToken(value)
    expect(sessionStorage.getItem("id_token")).toEqual(encrypted.toString());
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

  it('isUserLoggedin() true condition', () => {
    sessionStorage.setItem('access_token', "dssdfsdfsfsd")
   const isUser =  service.isUserLoggedin();
   const accessToken = sessionStorage.getItem('access_token')
   let verifyAccessToken
   if (accessToken != null) {
    verifyAccessToken = true;
  }else {
    verifyAccessToken =  false;
  }
    expect(isUser).toEqual(verifyAccessToken);
  });

  it('isUserLoggedin() false condition', () => {
   const isUser =  service.isUserLoggedin();
   const accessToken = sessionStorage.getItem('access_token')
   let verifyAccessToken
   if (accessToken != null) {
    verifyAccessToken = true;
  }else {
    verifyAccessToken =  false;
  }
    expect(isUser).toEqual(verifyAccessToken);
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

  // it('getUserProfile()', inject([OAuthService], (oauthService) => {
  //   service.getUserProfile()
  //   oauthService.loadUserProfile().then(user => {
  //     const abc = user;
  //     expect(abc).toBeTruthy();
  //   });
  // }));
});
