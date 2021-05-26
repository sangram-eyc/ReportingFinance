import {async,ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelHttpCallsInterceptor } from './cancel-http-calls.interceptor';
import { SettingsService } from '../services/settings.service';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CancelHttpCallsInterceptor', () => {
  let cancelInterceptor: CancelHttpCallsInterceptor;
  let settingService: SettingsService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CancelHttpCallsInterceptor,
      OAuthService, UrlHelperService, OAuthLogger
      ],
      imports: [RouterTestingModule, HttpClientTestingModule]
  }));
  

  

  it('should be created', () => {
    const interceptor: CancelHttpCallsInterceptor = TestBed.inject(CancelHttpCallsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
