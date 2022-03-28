import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { UserRolesService } from './user-roles.service';

describe('UserRolesService', () => {
  let service: UserRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule, HttpClientTestingModule]
    });
    service = TestBed.inject(UserRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRolesList method should return list',()=>{
    let url = `http://localhost:4200/assets/mock/userroles.json?module=reg-reporting`;

    spyOn(service['apiService'],'invokeGetAPI');
    service.getRolesList('reg-reporting');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url)
  });

  it('updateRoles method should update the roles',()=>{
    let url = `http://localhost:4200/gatewayService/api/v2/authorization/roleModuleFeatures`;
    spyOn(service['apiService'],'invokePostAPI');
    service.updateRoles({userId: 121, userEmail:'n1@ey.co'});

    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith(url,{userId: 121, userEmail:'n1@ey.co'})
  })
});
