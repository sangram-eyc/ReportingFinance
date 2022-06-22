import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router,ActivatedRoute} from '@angular/router';
import {OauthService} from '../../services/oauth.service';
import { OAuthService} from 'angular-oauth2-oidc';
import {SettingsService} from '../../../services/settings.service';
import {EYC_LOGIN} from '../../../services/settings-helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoogedInUser = false;
  isEycLogin = EYC_LOGIN;
  showToasterIfUserSessionExtent = false;
  constructor(private router: Router,private oauthSvc: OauthService,
    private oauthService: OAuthService,
    private activatedRoute: ActivatedRoute,private settingsService: SettingsService) { 
      this.isLoogedInUser = this.settingsService.isUserLoggedin()
 }

  ngOnInit(): void {
    if(sessionStorage.getItem('navigateToLogin') && sessionStorage.getItem('navigateToLogin') !== undefined) {
      this.showToasterIfUserSessionExtent = true;
      sessionStorage.removeItem('navigateToLogin')
    }
    if (EYC_LOGIN) {
      this.eycWebApplogin();
    }
      this.activatedRoute.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.isLoogedInUser = false;
      }
      
      
    });
    
}

  routeToHome() {
    if (!EYC_LOGIN) {
      this.eycWebApplogin();
      
    }
  }
  eycWebApplogin() {
  
    if (!this.oauthService.getAccessToken()) {
      this.oauthSvc.login();
    }
    else {
      this.router.navigate(['/home'])
    }
  }
}
