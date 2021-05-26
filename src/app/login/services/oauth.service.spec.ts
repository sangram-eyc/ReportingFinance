import { TestBed } from '@angular/core/testing';
import { SettingsService } from '@default/services/settings.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { OauthService } from './oauth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('OauthService', () => {
  let service: OauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, RouterTestingModule],
      providers: [OAuthService, SettingsService, UrlHelperService, OAuthLogger]
    });
    service = TestBed.inject(OauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
