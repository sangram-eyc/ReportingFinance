import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { EMPTY, of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  // let testBedService: UsersService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserTestingModule,BrowserDynamicTestingModule,
        MatDialogModule, BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [OAuthService, UrlHelperService, OAuthLogger,
         MatDialogModule, MatDialog, Overlay
       ],
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

  // it(`onMessage`, () => {
  //   let msg = component.onMessage(Event);
  //   expect(msg).toBeFalsy();
  // });
  
  it('openErrorModal method should open error modal',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>EMPTY} as any);
    component.openErrorModal('its header','error ocurred');
    expect(component['dialog'].open).toHaveBeenCalled();
  })

  it('checkTimeOut method should open error modal after timeout',fakeAsync(()=>{
    spyOn(sessionStorage,'getItem').and.returnValue('1000');
    component.checkTimeOut()
    tick(1000)
  }));


  it(`onMessage`, fakeAsync(() => {
    let mockData = {
      data : '#access_token=wwew1212ewwe'
    }
    spyOn(sessionStorage,'getItem').and.returnValue('1234qwe')
    spyOn(component['settingsService'],'setIdToken');
    spyOn(component['settingsService'],'setToken');
    component.onMessage(mockData);
    tick(1000)
  }));

  it('ngOnInit method should navigate to home page',()=>{
    spyOn(sessionStorage,'getItem').and.returnValue('123qwe')
    spyOn(component['router'],'navigate');
    component.ngOnInit();
    expect(component['router'].navigate).toHaveBeenCalledWith(['home'])
  })

  it('ngAfterViewChecked method should check timeout and count',fakeAsync(()=>{
    component.count = 0;
    spyOn(component['settingsService'],'isUserLoggedin').and.returnValue(true);
    spyOn(component['oauthservice'],'getIdentityClaims').and.returnValue({uname: {unique_name : 'myname'}})
    spyOn(component,'checkTimeOut')
    component.ngAfterViewChecked();
    tick(0);
    expect(component.count).toEqual(1);
    expect(component.checkTimeOut).toHaveBeenCalled();

  }))

  it('notification method should disble notifflg after 1 sec',fakeAsync(()=>{
    component.notifFlag = false;
    component.notification();
    expect(component.notifFlag).toEqual(true)
    tick(1000)
    expect(component.notifFlag).toEqual(false)

  }))
});