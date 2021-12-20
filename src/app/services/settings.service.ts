import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {SESSION_ACCESS_TOKEN,SESSION_ENCRYPTION_KEY,SESSION_ID_TOKEN,ID_ENCRYPTION_KEY,SESSION_ENCRYPTION_IV,ID_ENCRYPTION_IV} from './settings-helpers';
import { environment } from '../../environments/environment';
import { OAuthService} from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import {authConfig} from '../login/helpers'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {authorization} from '../helper/api-config-helper';
import { v4 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  authdetails;
  constructor(private oauthService: OAuthService,private http: HttpClient) { }
  public API_ENDPOINT = environment.apiEndpoint;
  private pendingHTTPRequests$ = new Subject<void>();
// AUTHTOKEN FUNCTIONS
setToken = (value) => {
  const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_IV);
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
  {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  });
  sessionStorage.setItem(SESSION_ACCESS_TOKEN,encrypted);
 
}

  getToken = () => {
    const getDecryptedText = sessionStorage.getItem(SESSION_ACCESS_TOKEN);
    const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_IV);
    if (getDecryptedText != null) {
      var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    }
  }

  

  setIdToken = (value) => {
    const key = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_IV);
    console.log("Initial vector value",iv)
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    sessionStorage.setItem(SESSION_ID_TOKEN,encrypted);
   
  }
  
    getIdToken = () => {
      const getDecryptedText = sessionStorage.getItem(SESSION_ID_TOKEN);
      const key = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
      const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_IV);
      if (getDecryptedText != null) {
        var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
    }

    // decryptToken = (session_id,encryption_key) => {
    //   const getDecryptedText = sessionStorage.getItem(session_id);
    //   const key = CryptoJS.enc.Utf8.parse(encryption_key);
    //   const iv = CryptoJS.enc.Utf8.parse(encryption_key);
    //   if (getDecryptedText != null) {
    //     var decrypted = CryptoJS.AES.decrypt(getDecryptedText, key, {
    //       keySize: 128 / 8,
    //       iv: iv,
    //       mode: CryptoJS.mode.CBC,
    //       padding: CryptoJS.pad.Pkcs7
    //     });
    //     return decrypted.toString(CryptoJS.enc.Utf8);
    //   }
    // }

  public isUserLoggedin = () => {
    const accessToken = sessionStorage.getItem('access_token')
    if (accessToken != null) {
      return true;
    }
    else {
      return false;
    }
  }

  public logoff() {
		console.log('inside logout');
		this.oauthService.logOut();
		sessionStorage.removeItem("currentUserSession");
		sessionStorage.removeItem('session');
    sessionStorage.removeItem('permissionList');
    sessionStorage.removeItem('moduleLevelPermission');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('inActivityTime');
    sessionStorage.removeItem('adminPermissionList');
    sessionStorage.removeItem('pendingDownloadsBulk');
  }
  
  public get name() {
		const claims = this.oauthService.getIdentityClaims();
		if (!claims) {
			return null;
		}
		return claims;
	}

  
  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }

  public onCancelPendingRequests() {
    return this.pendingHTTPRequests$.asObservable();
  }

  loadAuthDetails() {
    return new Promise((resolve, reject) => {
      //An Http Get to my API to get the available authdetails
      // if (!sessionStorage.getItem(SESSION_ID_TOKEN)) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Correlation-ID': uuid()
          })
      this.http.get(`${authorization.auth_Details}`, {headers: headers}).subscribe(res => {
        //set the authdetails to authconfig to initialize the implict login
        this.authdetails = res;
        this.authdetails.data.sessionTimeout ? sessionStorage.setItem("inActivityTime", this.authdetails.data.sessionTimeout) : sessionStorage.setItem("inActivityTime", '600000');
        authConfig.loginUrl = this.authdetails.data.authenticationUrl;
        authConfig.logoutUrl = this.authdetails.data.logoutUrl;
        authConfig.redirectUri = environment.production ?  this.authdetails.data.redirectUrl : this.authdetails.data.redirectUrl;
        authConfig.clientId = this.authdetails.data.clientId;
        authConfig.silentRefreshRedirectUri = environment.production ? this.authdetails.data.silentRefreshRedirectUri : this.authdetails.data.silentRefreshRedirectUri;
        authConfig.resource = this.authdetails.data.resource;
        authConfig.timeoutFactor = environment.production ? this.authdetails.data.timeoutFactor : 0.25;
        authConfig.silentRefreshTimeout=  environment.production ? this.authdetails.data.timeoutFactor : 5000;
        resolve(true);
        
      })
    /* } else {
      resolve(true);
    } */
    });

  }

}

