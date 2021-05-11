import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Event, NavigationStart, NavigationEnd, NavigationError  } from '@angular/router';
import {OauthService} from '../../services/oauth.service';
import { OAuthService, JwksValidationHandler } from 'angular-oauth2-oidc';
import {SettingsService} from '../../../services/settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoogedInUser = false;
  constructor(private router: Router,private oauthSvc: OauthService,
    private oauthService: OAuthService,
    private activatedRoute: ActivatedRoute,private settingsService: SettingsService) { 
      this.isLoogedInUser = this.settingsService.isUserLoggedin()
 }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.oauthSvc.logoff();

      }
      else {
        this.eycWebApplogin();
        if (this.oauthService.getIdToken()) {
          this.settingsService.setIdToken(this.oauthService.getIdToken());
          }
      }

    });
    
}

  routeToHome(){
    this.router.navigate(['/home'])
  }

  eycWebApplogin()
  {
   
    if (!this.oauthService.getAccessToken()) {
      this.oauthSvc.login();
    }
    else {
      this.routeToHome();
    }
  }
}
