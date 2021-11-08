import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router } from '@angular/router';
import { IS_SURE_FOOT } from '@default/services/settings-helpers';
import { SettingsService } from '@default/services/settings.service';
import { OAuthService, UrlHelperService, OAuthLogger } from 'angular-oauth2-oidc';
import { EMPTY, of } from 'rxjs';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const routerStub = {
    navigate : () => {}
  }

  const settingServiceStub = {
    setIdToken : () => {},
    logoff:()=>{}
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [HttpClientTestingModule,MatDialogModule, BrowserDynamicTestingModule, BrowserTestingModule],
      providers: [SettingsService, OAuthService, Overlay,MatDialog, UrlHelperService, OAuthLogger,
                  { provide: Router, useValue: routerStub},
                  { provide: SettingsService, useValue: settingServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('permissionList method should set permission',()=>{
    const mockData = {
      data: {
        features : {data: '' }
      }
    }
    spyOn(component,'navigation');
    spyOn(sessionStorage,'getItem').and.returnValue(null);
    spyOn(component['moduleLevelPermission'],'getPermissionsList').and.callFake(()=>{
      return of(mockData)
    });
    spyOn(sessionStorage,'setItem');
    component.permissionList();
    expect(component.navigation).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith("permissionList",JSON.stringify({data:''}))
  });


  it('permissionList method should not set permission and navigate',()=>{
    spyOn(component,'navigation');
    spyOn(sessionStorage,'getItem').and.returnValue('data');
    component.permissionList();
    expect(component.navigation).toHaveBeenCalled();
  })

  it('navigation method should navigate to tax-reporting',()=>{
    component.moduleLevelPermissionData = {
      userModules : {
        'All': ''
      }
    }

    spyOn(component['router'],'navigate');
    component.navigation();
    expect(component['router'].navigate).toHaveBeenCalled()
  });

  it('navigation method should navigate to app-regulatory-reporting',()=>{
    component.moduleLevelPermissionData = {
      userModules : {
        'Regulatory Reporting': ''
      }
    }

    spyOn(component['router'],'navigate');
    component.navigation();
    expect(component['router'].navigate).toHaveBeenCalled()
  });

  it('navigation method should navigate to data-intake',()=>{
    component.moduleLevelPermissionData = {
      userModules : {
        'Data Intake': ''
      }
    }

    spyOn(component['router'],'navigate');
    component.navigation();
    expect(component['router'].navigate).toHaveBeenCalled()
  });


  it('ngOnInit method should set token',()=>{
      spyOn(sessionStorage,'getItem').and.returnValue("token123ASD");
      spyOn(component['settingsService'],'setIdToken');
      component.ngOnInit();
      expect(component['settingsService'].setIdToken).toHaveBeenCalledWith('token123ASD')
  })

  it('ngOnInit method should open error modal',()=>{
    spyOn(component['moduleLevelPermission'],'getModuleLevelPermission').and.callFake(()=>{
      return of([{data : ''}])
    });
    spyOn(component,'openErrorModal');
    component.ngOnInit();
    expect(component.openErrorModal).toHaveBeenCalled()
  });

  it('ngOnInit method should set permission in session storage',()=>{
    const mockData = {
      data : {
        userModules : ''
      }
    }
    spyOn(sessionStorage,'setItem')
    spyOn(component['moduleLevelPermission'],'getModuleLevelPermission').and.callFake(()=>{
      return of(mockData)
    })
    component.ngOnInit();
    expect(sessionStorage.setItem).toHaveBeenCalled()
  });

 it('openErrorModal method should open error modal',()=>{
  spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of({data: 'data'})} as any);
   component.openErrorModal('error found header ','its 404 error');
  expect(component['dialog'].open).toHaveBeenCalled();
 })
});

