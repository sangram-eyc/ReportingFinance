import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {SESSION_ACCESS_TOKEN,SESSION_ENCRYPTION_KEY,SESSION_ID_TOKEN,ID_ENCRYPTION_KEY,SESSION_ENCRYPTION_IV,ID_ENCRYPTION_IV} from './settings-helpers';
import { environment } from '../../environments/environment';
import { OAuthService} from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';
import {authConfig} from '../login/helpers'
import { HttpClient } from '@angular/common/http';
import {authorization} from '../helper/api-config-helper';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
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
      this.http.get(`${authorization.auth_Details}`).subscribe(res => {
        //set the authdetails to authconfig to initialize the implict login
        authConfig.loginUrl = res['authenticationUrl'];
        authConfig.logoutUrl = res['logoutUrl'];
        authConfig.redirectUri = environment.production ?  res['redirectUrl'] : res['redirectUrl'];
        authConfig.clientId = res['clientId'];
        authConfig.silentRefreshRedirectUri = environment.production ?  res['silentRefreshRedirectUri'] : res['silentRefreshRedirectUri'];
        authConfig.resource = res['resource'];
        authConfig.timeoutFactor = environment.production ? res['timeoutFactor'] : 0.25;
        authConfig.silentRefreshTimeout=  environment.production ? res['timeoutFactor'] : 5000;
        resolve(true);
        
      })
    /* } else {
      resolve(true);
    } */
    });

  }

}


