import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {SESSION_ACCESS_TOKEN,SESSION_ENCRYPTION_KEY,SESSION_ID_TOKEN,ID_ENCRYPTION_KEY} from './settings-helpers';
import { environment } from '../../environments/environment';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  constructor(private oauthService: OAuthService) { }
  public API_ENDPOINT = environment.apiEndpoint;
  private errors = new Subject<string[]>();
// AUTHTOKEN FUNCTIONS
setToken = (value) => {
  const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
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
    const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
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
    const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
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
      const iv = CryptoJS.enc.Utf8.parse(ID_ENCRYPTION_KEY);
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

	public getUserProfile() {
		this.oauthService.loadUserProfile().then(user => {
        console.log('user : ', user);
        const abc = user;
			});
	}

}

