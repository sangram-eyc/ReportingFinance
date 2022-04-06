import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule} from '@angular/common/http';
import { UserDetailsComponent } from './user-details.component';
/* import { MotifAvatarModule, MotifButtonModule, MotifModule, MotifFormsModule} from '@ey-xd/ng-motif'; */
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from '../../users/services/users.service';
/* import { SettingsService } from 'src/app/services/settings.service';
import { OauthService } from 'src/app/login/services/oauth.service'; */
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { AdministrationService } from '@default/administration/services/administration.service';



describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let testBedService: UsersService;
 
const administrationServiceStub = {
  getCurrentModule : ()=> {}
}

let formControlStub = {
  editUserForm : {
      valid : () =>{
        return true
      }
  }
}
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [ UserDetailsComponent ],
      providers: [UsersService, OAuthService, UrlHelperService, OAuthLogger,
          { provide:FormControl, useValue: formControlStub},
          { provide: AdministrationService, useValue:administrationServiceStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    testBedService = TestBed.get(UsersService)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enable edit form',()=> {​​​​​​​​
  let enableEditor = true;
  component.enableEditForm();
  expect(component.enableEditor).toBe(enableEditor);
  }​​​​​​​​);

  it('cancel form',()=> {​​​​​​​​
  let showToastAfterEditUser  = false;
  component.userInfo ={​​​​​​​​"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}​​​​​​​​
  let enableEditor = true;
  component.cancelForm();
  expect(component.showToastAfterEditUser).toBe(showToastAfterEditUser);
  }​​​​​​​​); 


  it('backToUserAdmin method should change the tab',()=>{
    spyOn(component['location'],'back')
    spyOn(sessionStorage,'setItem')
    component.backtoUserAdmin();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('adminTab','2');
    expect(component['location'].back).toHaveBeenCalled();
  });


  it('getUsersData method should get users data',()=>{
    let mockData = {
      data : { userLastName :'mk',
      userFirstName:'nitin', 
      userEmail:'nitin.mk@ey.co'
    }}
    spyOn(component.editUserForm,'patchValue');
    spyOn(component['userService'],'userDetails').and.callFake(()=>{
      return of(mockData)
    });
    component.getUsersData();
    expect(component['userService'].userDetails).toHaveBeenCalled();
  });


  it('onSubmitEditUserForm', () => {
    const resp ={"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}
    let form = new FormGroup({
      first: new FormControl( resp.userFirstName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      last: new FormControl(resp.userLastName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      email: new FormControl(resp.userEmail.trim(), [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)])
    });
    spyOn(testBedService, 'editUser').and.returnValue(of(resp));
    component.onSubmitEditUserForm(form);
  });


});