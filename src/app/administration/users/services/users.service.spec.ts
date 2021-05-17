import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { UsersService } from './users.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OauthService } from 'src/app/login/services/oauth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [SettingsService,OauthService]
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return list fillings', () => {
    service.getUsersList().subscribe(resp => {
      expect(resp).toEqual(
        {
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
          }
      )
    })
  });

});
