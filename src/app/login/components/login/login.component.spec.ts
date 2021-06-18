import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

import { LoginComponent } from './login.component';
import {EYC_LOGIN} from '../../../services/settings-helpers';
import { OauthService } from '@default/login/services/oauth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  // let oauthService: OAuthService;
  // let oauthSvc: OauthService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [OAuthService, UrlHelperService, OAuthLogger, OauthService]
    })
    .compileComponents();
  }));
  // oauthService = TestBed.inject(OAuthService);
  // oauthSvc = TestBed.inject(OauthService);
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('if eyc login is true', () => {
    component.isEycLogin= true;
     let eycWebAppFun;
     if(component.isEycLogin){
      eycWebAppFun = spyOn(component, 'eycWebApplogin').and.callThrough();
     }
     component.ngOnInit();
     fixture.detectChanges();
     expect(eycWebAppFun).toBeTruthy();
   })

   it('if eyc login is true', () => {
    component.isEycLogin= true;
     let eycWebAppFun;
     if(component.isEycLogin){
      eycWebAppFun = spyOn(component, 'eycWebApplogin').and.callThrough();
     }
     component.ngOnInit();
     fixture.detectChanges();
     expect(eycWebAppFun).toBeTruthy();
   })
   
   it('routeToHome', () => {
    component.isEycLogin= true;
    component.routeToHome();
     fixture.detectChanges();
     let eycWebAppFun;
     if(component.isEycLogin){
      eycWebAppFun = spyOn(component, 'eycWebApplogin').and.callThrough();
     }
     component.ngOnInit();
     fixture.detectChanges();
     expect(eycWebAppFun).toBeTruthy();
   })

  it('eycWebApplogin', inject([OAuthService, OauthService], (oauthService, oauthSvc) => {
    component.eycWebApplogin();
    let myspy;
    if (!oauthService.getAccessToken()) {
    myspy = spyOn(oauthSvc, 'login').and.callThrough();
    }
    expect(myspy).toBeTruthy();
  }));

  it('eycWebApplogin', inject([OAuthService, OauthService], (oauthService, oauthSvc) => {
    component.eycWebApplogin();
    let myspy;
    if (oauthService.getAccessToken()) {
    myspy = spyOn(oauthSvc, 'login').and.callThrough();
    }
    
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
