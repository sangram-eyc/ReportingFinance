import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdministrationService } from '@default/administration/services/administration.service';
import { of } from 'rxjs';

import { UserRolesComponent } from './user-roles.component';

describe('UserRolesComponent', () => {
  let component: UserRolesComponent;
  let fixture: ComponentFixture<UserRolesComponent>;

  const administrationServiceStub = {
    getCurrentModule : () =>{

    }
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesComponent ],
      imports: [HttpClientModule,HttpClientTestingModule],
      providers : [
        {provide: AdministrationService, useValue:administrationServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('openAccord method should increment permissions',()=>{
    component.isValidPermission = 1;
    component.openAccord('','user');
    expect(component.isValidPermission).toEqual(2)
  });

  it('openAccord method should decrement permissions',()=>{
    component.isValidPermission = 2;
    component.closeAccord('','user');
    expect(component.isValidPermission).toEqual(1)
  });

  it('onSave method should save roleName',fakeAsync(()=>{
    spyOn(component['service'],'updateRoles').and.callFake(()=>{
      return of([])
    });
    component.showToastAfterRolesUpdate = true;
    component.onSave('user')
    expect(component['service'].updateRoles).toHaveBeenCalled();
    tick(5000);
  }));

  it('getRolesList method should get roles list',()=>{
    const mockData = { 
      data :  { 
        roleModuleFeatures : {
          user:''
        } 
      }
    }
    spyOn(component['service'],'getRolesList').and.callFake(()=>{
      return of(mockData)
    });
    component.getRolesList();
    expect(component['service'].getRolesList).toHaveBeenCalled();
  });

  it('onChangePermission method should change the permission',()=>{
    component.selectedPermission = {
      user : {
        moduleFeatureIds : ['101']
      }
    }

    let mockPermission = {
      moduleFeatureId : '101'
    }

    component.onChangePermission('',mockPermission,'user');

  })

  it('onChangePermission method should change the permission',()=>{
    component.selectedPermission = {
      user : {
        moduleFeatureIds : ['101']
      }
    }

    let mockPermission = {
      moduleFeatureId : '1'
    }

    component.onChangePermission('',mockPermission,'user');
    expect(component.selectedPermission.user.moduleFeatureIds).toEqual(['101','1']);
  })
});
