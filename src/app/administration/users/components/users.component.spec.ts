import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { UsersService } from '../services/users.service';
import { of, throwError } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { MotifTableModule } from '@ey-xd/ng-motif';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Overlay } from '@angular/cdk/overlay';
import { AdministrationService } from '@default/administration/services/administration.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';



describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let testBedService: UsersService;
  
  const administrationServiceStub = {
    getCurrentModule : () => {}
  }

  let routerStub = {
    navigate :()=> {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        MatDialogModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MotifTableModule,
        AgGridModule.withComponents([])
      ],
      declarations: [UsersComponent],
      providers: [OAuthService, UrlHelperService, OAuthLogger, UsersService, MatDialog, Overlay,
                  {provide: AdministrationService, useValue:administrationServiceStub},
                { provide:Router, useValue:routerStub}]
    })
      .compileComponents();
      fixture = TestBed.createComponent(UsersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      testBedService = TestBed.get(UsersService)
  }));

  beforeEach(() => {
   
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmitEditUserForm', () => {
    const resp ={"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}
    let form = new FormGroup({
      first: new FormControl( resp.userFirstName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      last: new FormControl(resp.userLastName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      email: new FormControl(resp.userEmail.trim(), [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)])
    });
    component.addUserForm.patchValue({
      first: resp.userFirstName.trim(),
      last: resp.userLastName.trim(),
      email: resp.userEmail.trim() 
    })
    spyOn(testBedService, 'addUser').and.returnValue(of(resp))
    component.onSubmitAddUserForm(form)
    expect(component['userService'].addUser).toHaveBeenCalled()
  });

  it('onSubmitEditUserForm should disble add user modal when call throws an error', () => {
    let form = new FormGroup({});
    let errorData = new HttpErrorResponse({
      error:'404 error',
      status:404,
      statusText:'Not found'
    })
    spyOn(component['userService'], 'addUser').and.returnValue(throwError(errorData))
    component.onSubmitAddUserForm(form)
  });

  it( `closeAddUserModal`, () => {
    let showAddUserModal  = false;
    fixture.detectChanges();
  }); 

  it( `closeAddUserModal`, () => {
    let showAddUserModal  = false;
    component.closeAddUserModal();
    fixture.detectChanges();
  }); 

  it( `closeAddUserModal`, () => {
    let response: any;
    component.selectedUser = response;
    component.onClickDeleteUserIcon(response);
    fixture.detectChanges();
  }); 
   
    it( `searchFilingValidation`, () => {
    const keyEvent = new KeyboardEvent('keypress', {key: "abc"});
    const checkVal = component.searchFilingValidation(keyEvent);
    expect(checkVal).toBeFalsy();
    });  

   it('editAcc method should return template',()=>{
     component.editAct('click')
   })

   it('handleGridReady method should set grid API',()=>{
     const mockData = {
       api : 'data'
     }
     component.handleGridReady(mockData);
     expect(component.gridApi).toEqual('data')
   });

   it('noWhitespaceValidator method should return validation with whitespace',()=>{
    const mockData = {
      value:' '
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual({whitespace:true})
  });

    it('editUser method should navigate to edit page',()=>{
    const mockRow = {
      userId: '1011'
    }
    spyOn(component['router'],'navigate');
    component.editUser(mockRow);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/user-details/1011'])
  });

  it(`deleteUser`, () => {​​​​​​​​

    const data = {
    "success": true,
    "message": "string",
    "data": [{
      "userId": 1,
      "userEmail": "string",
      "userDetails": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
        },
      "userType": "string",
      "firstName": "string",
      "lastName": "string",
      "isAdmin": 0,
      "createdDate": "2021-06-10T10:26:56.325Z",
      "updatedDate": "2021-06-10T10:26:56.325Z",
      "fullName": "string"
    }]
    };
  
    component.selectedUser= data;
    component.usersListArr = [{firstName:'n1',lastName:'m1'}]
    spyOn(testBedService, 'removeUser').withArgs(component.selectedUser['userId']).and.returnValue(of(data));
    // spyOn(component['userService'],'removeUser').and.callFake(()=>{
    //   return of(data)
    // })
    component.deleteUser();
    expect(component['userService'].removeUser).toHaveBeenCalled()
    }​​​​​​​​);


    it(`getUsersData should fetch all the data`, () => {​​​​​​​​
      const resp = {
        "success": true,
        "message": "User found.",
        "data": [{
          "userId": 551,
          "userEmail": "Koteswararao.Yarlagadda@ey.com",
          "userDetails": {},
          "userType": "Internal",
          "userFirstName": "Koteswararao",
          "userLastName": "Yarlagadda",
          "isAdmin": 1,
          "createdDate": "2021-04-30 07:30:47",
          "updatedDate": "2021-04-30 07:30:47",
          "fullName": "Koteswararao Yarlagadda"
        }]
        };
  
      spyOn(component['permissions'],'validateAllPermission').and.returnValue(true)
      spyOn(component['userService'], 'getUsersList').and.callFake(()=>{
        return of(resp);
      })
      component.getUsersData();
      expect(component['permissions'].validateAllPermission).toHaveBeenCalled();
      expect(component.userResp).toEqual([resp.data])
      }​​​​​​​​);
});
