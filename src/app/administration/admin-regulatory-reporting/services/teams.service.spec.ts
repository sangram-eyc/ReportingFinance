import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TeamsService } from './teams.service';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: []
    });
    service = TestBed.inject(TeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTeamsList method should return team list',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const url = 'http://localhost:4200/assets/mock/teams.json?module=userModule'
    let res= service.getTeamsList('userModule');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  })

  it('getTeamsDetails method should return team details',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const url = 'http://localhost:4200/assets/mock/teams.json01'
    let res= service.getTeamsDetails('01');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  })

  it('getRoles method should return roles',()=>{
    spyOn(service['apiService'],'invokeGetAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/roles?module=userModule'
    let res= service.getRoles('userModule');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith(url);
  })

  it('addTeam method should return add team and return it',()=>{
    spyOn(service['apiService'],'invokePostAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const mockTeamData = {
      role:''
    }
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/team';
    let res= service.addTeam(mockTeamData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith(url,mockTeamData);
  })

  it('deleteTeam method should delete team',()=>{
    spyOn(service['apiService'],'invokeDeleteAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/team/01'
    let res= service.deleteTeam('01');
    expect(service['apiService'].invokeDeleteAPI).toHaveBeenCalledWith(url);
  });

  it('addTeamMemebr method should add teammember',()=>{
    spyOn(service['apiService'],'invokePostAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const mockTeamData = {
      role:''
    }
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/teamMember';
    let res= service.addTeamMemebr(mockTeamData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith(url,mockTeamData);
  })

  it('deleteTeamMember method should delete team member',()=>{
    spyOn(service['apiService'],'invokePostAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const mockTeamData = {
      role:''
    }
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/removeteamMember';
    service.deleteTeamMember(mockTeamData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith(url,mockTeamData);
  });

  it('EditTeam method should edit team data',()=>{
    spyOn(service['apiService'],'invokePostAPI').and.callFake(()=>{
      return of({data:[]})
    })
    const mockTeamData = {
      role:''
    }
    const url = 'http://localhost:4200/gatewayService/api/v2/authorization/teamUpdate'
    service.EditTeam(mockTeamData);
    expect(service['apiService'].invokePostAPI).toHaveBeenCalledWith(url,mockTeamData);
  });
});
