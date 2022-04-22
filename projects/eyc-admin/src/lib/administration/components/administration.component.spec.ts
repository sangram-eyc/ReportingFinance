import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { AdministrationComponent } from './administration.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import { of } from 'rxjs';


describe('AdministrationComponent', () => {
  let component: AdministrationComponent;
  let fixture: ComponentFixture<AdministrationComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrationComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule],
      providers: [OAuthService,UrlHelperService,OAuthLogger,
        {provide: Router, useValue: router}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('routeAdminRR method should navigate to admin dashboard page', () => {
    component.routeAdminRR();
    expect(component['service'].module).toEqual('Regulatory Reporting')
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  })

  it('routeAdmin method should navigate to admin dashboard page', () => {
    let mockModule = 'admin'
    component.routeAdmin(mockModule);
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  })

  it('returnModuleID method should  return module ID',()=>{
    const mockData = {
      userModules: {
        user : '101'
      }
    }
    spyOn(sessionStorage,'getItem').and.returnValue(JSON.stringify(mockData));
    let result = component.returnModuleID('user')
    expect(result).toEqual('101')
  });

  it('ngOnInit method should set module details when permissions returns true',()=>{
    spyOn(component['moduleLevelPermission'],'checkPermission').and.returnValue(true);
    const mockData = {
      userModules : {
        All:'All',
        Other:'Other'
      }
    }
    spyOn(sessionStorage,'getItem').and.returnValue(JSON.stringify(mockData));
    component.ngOnInit()
    expect(component['moduleLevelPermission'].checkPermission).toHaveBeenCalledWith('All');
    expect(component.modules).toEqual([{moduleName:'Other',moduleId:'Other'}])
  })

  it('ngOnInit method should set module details when permissions returns false',()=>{
    const mockData = {
      data : {
        features: {
          Default:'',
          Other:'other'
        }
      }
    }
    spyOn(component['moduleLevelPermission'],'checkPermission').and.returnValue(false);
    spyOn(component['service'],'getPermissionsList').and.callFake(()=>{
      return of(mockData)
    })
    spyOn(component,'returnModuleID').and.returnValue('other')
    component.ngOnInit()
    expect(component['moduleLevelPermission'].checkPermission).toHaveBeenCalledWith('All');
    expect(component['service'].getPermissionsList).toHaveBeenCalled();
  })

});
