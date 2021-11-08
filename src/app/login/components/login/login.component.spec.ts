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
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('eycWebAppLogin method should navigate to home page',()=>{
    spyOn(component['router'],'navigate')
    spyOn(component['oauthService'],'getAccessToken').and.returnValue('qwe123');
    component.eycWebApplogin();
    expect(component['router'].navigate).toHaveBeenCalledWith(['/home'])
  })

  it('eycWebAppLogin method should call login method',()=>{
    spyOn(component['router'],'navigate');
    spyOn(component['oauthSvc'],'login');
    spyOn(component['oauthService'],'getAccessToken').and.returnValue(null);
    component.eycWebApplogin();
    expect(component['oauthSvc'].login).toHaveBeenCalled()
    expect(component['router'].navigate).not.toHaveBeenCalledWith(['/home'])
  });


  it('routeToHome', () => {
    spyOn(component,'eycWebApplogin')
    component.routeToHome();
    expect(component.eycWebApplogin).toHaveBeenCalled()
   });
});
