import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { UsersService } from './users.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OauthService } from 'src/app/login/services/oauth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [SettingsService,OauthService, OAuthService, UrlHelperService, OAuthLogger]
    });
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('invokeUserGetAPI should http GET ', () => {

    const data = {
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
      };

    let curentUserId = 1;
    
    const url = "/assets/mock/userInfo.json"
    service.userDetails(curentUserId).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));


      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("GET");
      req.flush(data);

      httpMock.verify();
    });
  });

  it('invokeUserPutAPI should http PUT ', () => {

    const data = {
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
      };

    let curentUserId = 1;
    let fData;
    
    const url = "/assets/mock/userInfo.json"
    service.editUser(curentUserId, fData).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));


      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("PUT");
      req.flush(data);

      httpMock.verify();
    });
  });

  it('invokeUserPostAPI should http POST ', () => {

    const data = {
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
      };

    let curentUserId = 1;
    let fData;
    
    const url = "/assets/mock/userInfo.json"
    service.addUser(fData).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));


      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("POST");
      req.flush(data);

      httpMock.verify();
    });
  });

  it('invokeDeleteAPI should http DELETE ', () => {

    const data = {
      "success": true,
      "message": "string",
      "data": {
        "userId": 0,
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

    let curentUserId = 1;
    // let fData;
    
    const url = "/assets/mock/userInfo.json"
    service.removeUser(curentUserId).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));


      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("DELETE");
      req.flush(data);

      httpMock.verify();
    });
  });

});