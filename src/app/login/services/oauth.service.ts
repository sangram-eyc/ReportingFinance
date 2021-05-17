import { Injectable } from '@angular/core';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import { LOCAL_STORAGE_ID_CURRENT_USER_SESSION } from '../helpers';
import { authConfig } from '../helpers';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {SettingsService} from '../../services/settings.service'
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private oauthService: OAuthService, private storageService: SettingsService,
    private httpClient: HttpClient) {
    this.oauthService.configure(authConfig);
    // this.oauthService.setupAutomaticSilentRefresh();
	this.oauthService.tryLogin({});
	
    if (this.oauthService.getAccessToken()) {
	  this.getAccessToken();
	 
	}
	
	
    
  }

  public login() {
		console.log('inside login');
			this.oauthService.initImplicitFlow();
		
  }
  public logoff() {
		console.log('inside logout');
		
			this.oauthService.logOut();
		
		sessionStorage.removeItem(LOCAL_STORAGE_ID_CURRENT_USER_SESSION);
		sessionStorage.removeItem('session');
	}

	public getAccessToken() {
		console.log('inside getAccessToken');
		console.log(this.oauthService.getAccessToken());
		//sessionStorage.setItem(LOCAL_STORAGE_ID_CURRENT_USER_SESSION, this.oauthService.getAccessToken());
		this.storageService.setToken(this.oauthService.getAccessToken())
		
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
				
			});
	}

	public refreshToken() {
		this.oauthService.silentRefresh()
			.then(info => {
				console.log('refresh ok', info);
				if (this.oauthService.getAccessToken()) {
					console.log(this.oauthService.getAccessToken());
					this.getAccessToken();
				}
			})
			.catch(err => console.log('refresh error', err));
	}
}