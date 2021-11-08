import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InjectionToken } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrationService } from '@default/administration/services/administration.service';
import { UsersService } from '@default/administration/users/services/users.service';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { PermissionService } from 'eyc-ui-shared-component';
import { EMPTY, of } from 'rxjs';
import { TeamsService } from '../services/teams.service';

import { EycTeamDetailsComponent } from './eyc-team-details.component';

describe('EycTeamDetailsComponent', () => {
  let component: EycTeamDetailsComponent;
  let fixture: ComponentFixture<EycTeamDetailsComponent>;
  const routerStub = {
    //navigate : () => {}
     navigate: jasmine.createSpy('navigate')
  };
const permissionServiceStub = {
  validateAllPermission : () =>{}
}

const administrationServiceMock ={
  getCurrentModule : () => ''
}

const teamsServiceStub = {
  getRoles : () => {},
  getTeamDetailsData: () => {
    return {teamName:'rega',teamDescription:'team',role:'user'}
  },
  getTeamsDetails:()=> {}
}

const httpHandlerStub ={
handle : ()=> { 
  return of()
}
}

const userServiceStub = {
  getUsersList : () => {
    return of()
  }
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EycTeamDetailsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers:[HttpClient,MatDialog, Overlay,
        ModuleLevelPermissionService,PermissionService,
        OAuthService,UrlHelperService, FormBuilder, OAuthLogger,
        {provide: AdministrationService, useValue:administrationServiceMock},
        {provide: HttpHandler, useValue: httpHandlerStub},
        {provide: UsersService,useValue:userServiceStub},
        {provide: TeamsService, userValue: teamsServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EycTeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('backtoTeamView method should change tab',()=>{
    spyOn(sessionStorage,'setItem');
    spyOn(component['location'],'back');
    component.backtoTeamVIew();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('adminTab','1');
    expect(component['location'].back).toHaveBeenCalled();
  })

  it('enableEditForm method should manage edit form',()=>{
    component.enableEditor = false;
    component.enableEditForm();
    expect(component.enableEditor).toEqual(true);
  })

  it('closeTeamMemberModal method should hide modal ',()=>{
    spyOn(component['addTeamMemberForm'],'reset');
    component.closeTeamMemberModal();
    expect(component.addTeamMemberModal).toEqual(false);
    expect(component['addTeamMemberForm'].reset).toHaveBeenCalled();
    expect(component.multiSelectValues).toEqual(null);
  })

  it('addTeamMembers method should add team member ',()=>{
    const mockData = ""
    component.addTeamMembers(mockData);
    expect(component.addTeamMemberModal).toEqual(true);
  })


  it('teamDuplicateCheck should check validations',()=>{
    component.teamsListArr = [{
      teamName : 'avengers'
    }];

    const mockTeamName = 'avengers';
    component.teamDuplicateCheck(mockTeamName);
  });

  it('adminTabChnage method should chnage tab',()=>{
    const mockTab = 'admin';
    component.adminTabChange(mockTab);
    expect(component.tabIn).toEqual('admin')
  })

  it('cancelForm method should disable form',()=>{
    spyOn(component['editTeamForm'],'patchValue');
    component.enableEditor = true;
    component.disableAddMemberButton = true;
    component.teamInfo = {
      teamName : 'Avengers',
      role:'admin',
      teamDescription : ''
    }

    component.cancelForm();
    expect(component.showToastAfterEditTeam).toEqual(false);
    expect(component.enableEditor).toEqual(false);
    expect(component.disableAddMemberButton).toEqual(false)
  })

  it('removeChipMember method should splice values',()=>{
    component.multiSelectValues = [2,3,4,5];
    component.removeChipMember("",1);
    expect(component.multiSelectValues).toEqual([2,4,5]);
  })

  it('logEvent method should log the details',()=>{
    component.logEvent('','','');
  })


  it('getTeamDetailsData method should call all methods to fetch the details',()=>{
    component.teamInfo = {
      teamName:'user',
      role:'admin',
      teamDescription:'its a team'
    }

    let mockTeamDetails = {
      data : {
        teamMembers: [{userId:'user1',userEmail:'n1@ey.co',userFirstName:'n1',userLastName:'m1'}]
      }
    }
    spyOn(component,'getUsersList');
    spyOn(component['teamService'],'getTeamsDetails').and.returnValue(of(mockTeamDetails));
    component.getTeamDetailsData();
    expect(component['teamService'].getTeamsDetails).toHaveBeenCalled();
  });

  it('ngOnInit method should set roles list',()=>{
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(true);
    spyOn(component['teamService'],'getRoles').and.callFake(()=>{
      return of({data: ['users','admmin']})
    });
    component.ngOnInit();
    expect(component['permissions'].validateAllPermission).toHaveBeenCalled();
    expect(component['teamService'].getRoles).toHaveBeenCalled()

  });


  it('ngOnInit method should set team Info data',()=>{
    (component as any)['teamService'] = {
      getTeamDetailsData : () =>{
        return true
      }
    }
    component.ngOnInit();
  })


  it('getUsersList method should set all users',()=>{
    let mockData = {
      data : [{userEmail:'m12@ey.co'},{userEmail:'m22@ey.co'}]
    }

    component.teamsMemberData = [{userEmail:'m12@ey.co'},{userEmail:'m22@ey.co'}]
    spyOn(component['permissions'],'validateAllPermission').and.returnValue(true);
    spyOn(component['userService'],'getUsersList').and.callFake(()=>{
      return of(mockData)
    });

    component.getUsersList();
    expect(component['permissions'].validateAllPermission).toHaveBeenCalled()
  })

  it('addTeamMembers method should open add team member modal',()=>{
    component.addTeamMembers('');
    expect(component.addTeamMemberModal).toEqual(true)
  })

  it('onSubmitNewTeamMembers method should submit new teammember',()=>{
    let mockData = {
      data : [
        { userId:'1101',userEmail:'n1@ey.co',userFirstName:'n1',userLastName:'m1'}
      ]
    }
    spyOn(component['addTeamMemberForm'],'getRawValue').and.returnValue({members : '123'});
    spyOn(component['teamService'],'addTeamMemebr').and.callFake(()=>{
      return of(mockData)
    });

    component.onSubmitNewTeamMembers()
  });

  it('deleteTeamMember method should delete row',()=>{
    spyOn(component['dialog'],'open').and.returnValue({afterClosed: ()=> EMPTY} as any);
    component.deleteTeamMember({});
    expect(component['dialog'].open).toHaveBeenCalled();
  });


  it('editAct method should return action section',()=>{
    let res = component.editAct('click');
  })


  
  xit('onSubmitEditForm method should submit edited form',()=>{
    let form = new FormGroup({});
    spyOn(component.editTeamForm,'getRawValue').and.returnValue({teamName:'taard',role:'user',teamDescription:'user team'});
    component.onSubmitEditTeamForm(form)
  })

});
