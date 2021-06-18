import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { CancelHttpCallsInterceptor } from './cancel-http-calls.interceptor';
import { SettingsService } from '../services/settings.service';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, ReplaySubject, throwError } from 'rxjs';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { take } from 'rxjs/operators';

describe('CancelHttpCallsInterceptor', () => {
  let cancelInterceptor: CancelHttpCallsInterceptor;
  let settingService: SettingsService;
  let interceptor: CancelHttpCallsInterceptor;
  let mySpy
  const eventSubject = new ReplaySubject<RouterEvent>(1);

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
    events: eventSubject.asObservable(),
    url: 'test/url'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CancelHttpCallsInterceptor,
        SettingsService,
        OAuthService, UrlHelperService, OAuthLogger,
        { provide: Router, useValue: routerMock }
      ],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    interceptor = TestBed.inject(CancelHttpCallsInterceptor);
    settingService = TestBed.inject(SettingsService);
  });

  it('should not call warning method with end navigation event', inject([SettingsService], (settingService: SettingsService) => {
    eventSubject.next(new NavigationEnd(1, 'regular', 'redirectUrl'));
    expect(spyOn(settingService, 'cancelPendingRequests')).not.toHaveBeenCalled();
  }));

  describe('cancel http calls intercept', () => {
    beforeEach(() => {
      const payload = {
        status: 200
      },
        response = new HttpErrorResponse(payload),
        next: any = {
          handle: jasmine.createSpy('handle').and.callFake(() => of(response))
        };

      interceptor.intercept(response as any, next).pipe(take(1))
        .subscribe();
    });

    describe('on cancel http request', () => {
      it('', () => {
        mySpy = spyOn(settingService, 'cancelPendingRequests').and.callThrough();
        expect(mySpy).toBeTruthy();
      });
    })
  });

  it('should be created', () => {
    const interceptor: CancelHttpCallsInterceptor = TestBed.inject(CancelHttpCallsInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
