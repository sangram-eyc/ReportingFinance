import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  // let testBedService: UsersService;
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],providers: [OAuthService, UrlHelperService, OAuthLogger ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  }));

  beforeEach(() => {
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it( `toggleSubMenu`, () => {
  //   component.toggleSubMenu('managed-submenu');
  //   const x = document.getElementById("managed-submenu");
  //   fixture.detectChanges();
  // });

  it( `notification`, () => {
    component.notification();
    fixture.detectChanges();
  });

  it( `navigatetonotifi`, () => {
    component.navigatetonotifi();
    fixture.detectChanges();
  });

  it( `toggleSideNav`, () => {
    component.toggleSideNav();
    fixture.detectChanges();
  });

  it( `toggleSubMenu`, () => {
    const toggleId = 'managed-submenu';
    component.toggleSubMenu(toggleId);
    fixture.detectChanges();
  });

  it( `logoff`, () => {
    component.logoff();
    fixture.detectChanges();
  });

  it(`outsideClick`, () => {
    let outSide = component.outsideClick(Event);
    expect(outSide).toBeFalsy();
  });

  it(`onMessage`, () => {
    let msg = component.onMessage(Event);
    expect(msg).toBeFalsy();
  });

});