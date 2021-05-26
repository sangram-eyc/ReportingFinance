import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule} from '@angular/common/http';
import { UserDetailsComponent } from './user-details.component';
import { MotifAvatarModule, MotifButtonModule, MotifModule, MotifFormsModule} from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from '../../users/services/users.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OauthService } from 'src/app/login/services/oauth.service';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';




describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let userService : UsersService;
  let mockUserList = {
    "success": true,
    "message": "sucess",
    "data": [
      {
      "userId": 4,
      "userEmail": "nandha.gopal@gds.ey.com",
      "userDetails": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      },
      "userType": "string",
      "firstName": "Nandha",
      "lastName": "Gopal N",
      "isAdmin": 0,
      "createdDate": "2021-04-28T07:05:58.544Z",
      "updatedDate": "2021-04-28T07:05:58.544Z",
      "fullName": "Nandha Gopal N"
      },
      {
      "userId": 3,
      "userEmail": "suhas.srinidhi@gds.ey.com",
      "userDetails": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      },
      "userType": "string",
      "firstName": "Suhas Talakad",
      "lastName": "Srinidhi",
      "isAdmin": 0,
      "createdDate": "2021-04-28T07:05:58.544Z",
      "updatedDate": "2021-04-28T07:05:58.544Z",
      "fullName": "Suhas Talakad Srinidhi"
      },
      {
      "userId": 1,
      "userEmail": " debabrata.dash@gds.ey.com",
      "userDetails": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      },
      "userType": "string",
      "firstName": "Debabrata",
      "lastName": "Dash",
      "isAdmin": 0,
      "createdDate": "2021-04-28T07:05:58.544Z",
      "updatedDate": "2021-04-28T07:05:58.544Z",
      "fullName": "Debabrata Dash"
      },
      {
      "userId": 6,
      "userEmail": "Koteswararao.Yarlagadda@ey.com",
      "userDetails": {
        "additionalProp1": {},
        "additionalProp2": {},
        "additionalProp3": {}
      },
      "userType": "string",
      "firstName": "Koteswara Rao",
      "lastName": "Yarlagadda",
      "isAdmin": 0,
      "createdDate": "2021-04-28T07:05:58.544Z",
      "updatedDate": "2021-04-28T07:05:58.544Z",
      "fullName": "Koteswara Rao Yarlagadda"
      }
    ]
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule, MotifAvatarModule, MotifButtonModule, MotifModule, MotifFormsModule, FormsModule, ReactiveFormsModule],
      declarations: [ UserDetailsComponent ],
      providers: [OAuthService, UrlHelperService, OAuthLogger]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  /* it('get users data',()=> {
		spyOn(component, 'getUsersData').and.callThrough(); 
		fixture.detectChanges();
		expect(component.getUsersData).toHaveBeenCalled();
	}); */

  // it('get users data',()=> {
  //   // spyOn(userService, 'get users data').and.returnValue('Mocked');


  //   spyOn(component, 'getUsersData').and.callThrough(); 
  //   fixture.detectChanges();
	// 	expect(component.getUsersData).toHaveBeenCalled();

	// });

  

});
