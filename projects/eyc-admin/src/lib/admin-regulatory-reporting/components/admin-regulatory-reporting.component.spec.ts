import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { forwardRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrationService } from '@default/administration/services/administration.service';
import { OauthService } from '@default/login/services/oauth.service';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { EMPTY, of } from 'rxjs';
import { TeamsService } from '../services/teams.service';

import { AdminRegulatoryReportingComponent } from './admin-regulatory-reporting.component';

describe('AdminRegulatoryReportingComponent', () => {
  let component: AdminRegulatoryReportingComponent;
  let fixture: ComponentFixture<AdminRegulatoryReportingComponent>;

  const routerStub = {
    navigate : () => {}
  };
const permissionServiceStub = {
  validateAllPermission : () =>{}
}

const administrationServiceMock ={
  getCurrentModule : () => ''
}

const teamsServiceStub = {
  getRoles : () => {},

  getTeamsList:() =>{
    return of()
  },

  addTeam:()=>{
    return of()
  }
}



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRegulatoryReportingComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      providers : [HttpClient,HttpHandler, Overlay,
        ModuleLevelPermissionService,
        OAuthService,UrlHelperService, OAuthLogger,FormBuilder,MatDialog,
        { provide: Router , useValue: routerStub},
        { provide: PermissionService, useValue: permissionServiceStub},
        { provide: AdministrationService, useValue: administrationServiceMock},
        { provide: TeamsService, useValue: teamsServiceStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegulatoryReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('admin tab change - Teams tab(tab 1)', () => {
    spyOn(component,'getTeamList');
    let tab = 1
    component.adminTabChange(tab);
    expect(component.tabIn).toBe(tab);
    expect(component.displayCheckBox).toBe(true);
    expect(component.getTeamList).toHaveBeenCalled();
  })


  it('admin tab change - users or admin tab', () => {
    spyOn(component,'getTeamList');
    let tab = 2
    component.adminTabChange(tab);
    expect(component.tabIn).toBe(tab);
    expect(component.displayCheckBox).toBe(false);
    expect(component.getTeamList).not.toHaveBeenCalled();
  });

  it('editAct method should  return tempale',()=>{
    component.editAct('');
  })

  it('createTeamRowData method should set columnDef',()=>{
    component.createTeamsRowData();
   // expect(component.columnDefs).toBe([{}])
  })

  it('noWhiteSpaceValidator method should return validation',()=>{
    const mockData = {
      value:'abcde'
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual(null)
  });

  it('noWhiteSpaceValidator method should return validation with whitespace',()=>{
    const mockData = {
      value:' '
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual({whitespace:true})
  });

  it('editTeams method should set data navigate to team-details path',()=>{
    spyOn(component['router'],'navigate');
    const mockData = {
      teamId:101
    }
    const url = '/team-details/'+mockData.teamId
    component.editTeams(mockData);
    expect(component['teamsService'].setTeamDetailsData).toEqual(mockData);
    expect(component['router'].navigate).toHaveBeenCalledWith([url])
  });

  it('addTeam method should show add team Modal',()=>{
    const mockData = {}
    component.addTeamModal = false;
    component.addTeam(mockData);
    expect(component.addTeamModal).toEqual(true)
  })

  it('closeTeamModal method should close add team modal',()=>{
    spyOn(component['addTeamForm'],'reset');
    component.closeTeamModal();
    expect(component.addTeamModal).toEqual(false);
    expect(component['addTeamForm'].reset).toHaveBeenCalled();
  });

  it('teamDuplicateCheck method should check duplicate team - duplicate',()=>{
    component.teamsData = [{
      teamName : 'abcd'
    }];

    const mockTeamName = 'abcd';
    component.teamDuplicateCheck(mockTeamName);
    //expect(component.addTeamForm.controls['abcd'].setErrors).toEqual({'teamDuplicate': true})
  })

  it('teamDuplicateCheck method should check duplicate team - not duplicate',()=>{
    component.teamsData = [{
      teamName : 'abcde'
    }];

    const mockTeamName = 'abcd';
    component.teamDuplicateCheck(mockTeamName);
  })

  it('getTeamList method should set team data',()=>{
    const mockData = [{
      data:{}
    }]
    spyOn(component,'createTeamsRowData');
    spyOn(component,'openErrorModal');
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(true);
    spyOn(component['teamsService'],'getTeamsList').and.returnValues(of(mockData));
    component.getTeamList();
    expect(component['permissions'].validateAllPermission).toHaveBeenCalled();
    expect(component['teamsService'].getTeamsList).toHaveBeenCalledWith(component.moduleName);
    expect(component.createTeamsRowData).toHaveBeenCalled();
    expect(component.openErrorModal).not.toHaveBeenCalled();
  })

  it('getTeamList method should not set team data',()=>{
    spyOn(component,'createTeamsRowData');
    spyOn(component,'openErrorModal');
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(false);
    component.getTeamList();
    expect(component['permissions'].validateAllPermission).toHaveBeenCalled();
    expect(component.createTeamsRowData).not.toHaveBeenCalled();
    expect(component.openErrorModal).toHaveBeenCalled();
  })

  it('ngOnInit method should call getTeamList function and set roles',()=>{
    const mockData = [{
      data:{}
    }]
    spyOn(sessionStorage,'getItem').and.returnValue("1");
    spyOn(component,'getTeamList');
    spyOn(component,'openErrorModal');
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(true);
    spyOn(component['teamsService'],'getRoles').and.returnValue(of(mockData))
    component.ngOnInit();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('adminTab');
    expect(component.getTeamList).toHaveBeenCalled();
    expect(component['permissions'].validateAllPermission).toHaveBeenCalledWith('adminPermissionList', component.moduleName, 'Add Teams');
    expect(component['teamsService'].getRoles).toHaveBeenCalledWith(component.moduleName);
  })

  it('ngOnInit method should not call getTeamList function',()=>{
    spyOn(sessionStorage,'getItem').and.returnValue("2");
    spyOn(component,'getTeamList');
    component.ngOnInit();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('adminTab');
    expect(component.getTeamList).not.toHaveBeenCalled();
  })

  it('ngOnInit method should call getTeamList function and show error modal',()=>{
    spyOn(sessionStorage,'getItem').and.returnValue("1");
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(false);
    component.ngOnInit();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('adminTab');
  });

  it('onSubmitNewTeam method should hide add team modal',()=>{
    const mockObj = {
      teamName : '',
      role:'',
      description:'it is a desc'
    }

    const mockData = [
      {data: 'data'}
    ]
    spyOn(component['addTeamForm'],'getRawValue').and.returnValue(mockObj);
    spyOn(component['addTeamForm'],'reset');

    spyOn(component['teamsService'],'addTeam').and.returnValue(of(mockData))

    component.onSubmitNewTeam();
    expect(component['addTeamForm'].getRawValue).toHaveBeenCalled()
    expect(component.addTeamModal).toEqual(false);
    expect(component['teamsService'].addTeam).toHaveBeenCalled();
  })

  it('deleteTeams method should delate team details',()=>{
    let mockRow = {
      teamId:'101',

    }

    spyOn(component['dialog'],'open').and.returnValue({afterClosed:()=>of()} as any);
    component.deleteTeams(mockRow);
    expect(component['dialog'].open).toHaveBeenCalled();
  })

});