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



describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let testBedService: UsersService;
 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule, FormsModule, ReactiveFormsModule],
      declarations: [ UserDetailsComponent ],
      providers: [UsersService, OAuthService, UrlHelperService, OAuthLogger]
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
  


  it('onSubmitEditUserForm', () => {
    const resp ={"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}
    let form = new FormGroup({
      first: new FormControl( resp.userFirstName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      last: new FormControl(resp.userLastName.trim(), [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250)]),
      email: new FormControl(resp.userEmail.trim(), [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)])
    });
    component.editUserForm.patchValue({
      first: resp.userFirstName.trim(),
      last: resp.userLastName.trim(),
      email: resp.userEmail.trim() 
    })
    spyOn(testBedService, 'editUser').and.returnValue(of(resp))
    component.onSubmitEditUserForm(form)
    expect(component.userInfo).toEqual(resp)
  });




  it('enable edit form',()=> {​​​​​​​​

  let enableEditor = true;
  component.enableEditForm();
  fixture.detectChanges();
  expect(component.enableEditor).toBe(enableEditor);
  }​​​​​​​​);

  it('cancel form',()=> {​​​​​​​​
  let showToastAfterEditUser  = false;
  component.userInfo ={​​​​​​​​"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}​​​​​​​​

  let enableEditor = true;
  component.cancelForm();
  fixture.detectChanges();
  expect(component.showToastAfterEditUser).toBe(showToastAfterEditUser);
  }​​​​​​​​); 


  it('should get user details', () => {​​​​​​​​
  const resp ={​​​​​​​​"userId":834,"userEmail":"dhlhfhl@yahoo.com","userFirstName":"test","userLastName":"user"}​​​​​​​​
  let name = 'sdsdsdsd sdsdsdsdsd';
  spyOn(testBedService, 'userDetails').and.returnValue(of(resp))
  component.ngOnInit();
  fixture.detectChanges();
  expect(component.userInfo).toEqual(resp);
  }​​​​​​​​);


 
});