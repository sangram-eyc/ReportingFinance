import { TestBed } from '@angular/core/testing';
import { HttpClientModule} from '@angular/common/http';
import { UsersService } from './users.service';
import { SettingsService } from 'src/app/services/settings.service';
import { OauthService } from 'src/app/login/services/oauth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthLogger, OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

describe('UsersService', () => {
  let service: UsersService;

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


  // it('should return list fillings', () => {
  //   service.getUsersList().subscribe(resp => {
  //     expect(resp).toEqual(
  //       [
  //         {
  //            "groups":[
  //             "string"
  //            ],
  //            "roles":[
  //             "string"
  //            ],
  //            "userId":4,
  //            "userEmail":"nandha.gopal@gds.ey.com",
  //            "userFirstName":"Nandha",
  //            "userLastName":"Gopal N"
  //         },
  //         {
  //            "groups":[
  //             "string"
  //            ],
  //            "roles":[
  //             "string"
  //            ],
  //            "userId":3,
  //            "userEmail":"suhas.srinidhi@gds.ey.com",
  //            "userFirstName":"Suhas Talakad",
  //            "userLastName":"Srinidhi"
  //         },
  //         {
  //            "groups":[
  //             "string"
  //            ],
  //            "roles":[
  //             "string"
  //            ],
  //            "userId":1,
  //            "userEmail":" debabrata.dash@gds.ey.com",
  //            "userFirstName":"Debabrata",
  //            "userLastName":"Dash"
  //         },
  //         {
  //            "groups":[
  //             "string"
  //            ],
  //            "roles":[
  //             "string"
  //            ],
  //            "userId":6,
  //            "userEmail":"Koteswararao.Yarlagadda@ey.com",
  //            "userFirstName":"Koteswara Rao",
  //            "userLastName":"Yarlagadda"
  //         }
  //        ]
  //     )
  //   })
  // });

});