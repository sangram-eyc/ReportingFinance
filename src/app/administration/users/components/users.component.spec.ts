import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { UsersComponent } from './users.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { UsersService } from '../services/users.service';
import { of } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { MotifTableModule } from '@ey-xd/ng-motif';



describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let testBedService: UsersService;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MotifTableModule,
        AgGridModule.withComponents([])
      ],
      declarations: [UsersComponent],
      providers: [OAuthService, UrlHelperService, OAuthLogger, UsersService]
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
    // expect(component.userInfo).toEqual(resp)
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
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

  it(`getUsersData`, () => {​​​​​​​​
    const resp = [{
      "success": true,
      "message": "User found.",
      "data": {
        "userId": 551,
        "userEmail": "Koteswararao.Yarlagadda@ey.com",
        "userDetails": {},
        "userType": "Internal",
        "firstName": "Koteswararao",
        "lastName": "Yarlagadda",
        "isAdmin": 1,
        "createdDate": "2021-04-30 07:30:47",
        "updatedDate": "2021-04-30 07:30:47",
        "fullName": "Koteswararao Yarlagadda"
      }
      }];
    spyOn(testBedService, 'getUsersList').and.returnValue(of(resp))
    component.getUsersData();
    fixture.detectChanges();
    expect(component.userResp[0]).toEqual(resp);
    }​​​​​​​​);

  it(`deleteUser`, () => {​​​​​​​​

  const data = {
  "success": true,
  "message": "string",
  "data": {
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
  }
  };

  component.selectedUser = data;
  spyOn(testBedService, 'removeUser').withArgs(component.selectedUser['userId']).and.returnValue(of(data))
  component.deleteUser();
  fixture.detectChanges();
  // expect(component.usersListArr).toEqual(data);
  }​​​​​​​​);

     
    it( `searchFilingValidation`, () => {
    const keyEvent = new KeyboardEvent('keypress', {key: "abc"});
    const checkVal = component.searchFilingValidation(keyEvent);
    expect(checkVal).toBeFalsy();
    });  

   
});
