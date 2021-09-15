import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { userAdminstration } from '../../../helper/api-config-helper';

@Injectable({
  providedIn: 'root'
})


export class TeamsService {

  TeamsData: any;

  constructor(private apiService: ApiService) { }

  set setTeamDetailsData(data) {
    this.TeamsData = data;
  }

  get getTeamDetailsData() {
    return this.TeamsData;
  }
  
  getTeamsList() {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.teams_list}?module=Regulatory%20Reporting`);
  }

  getTeamsDetails(teamId) {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.teams_Details}`+teamId);
  }

  getRoles(module) {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.roles}`+module);
  }

  addTeam(teamData) {
    return this.apiService.invokePostAPI(`${userAdminstration.teams.add_team}`,teamData);
  }
  deleteTeam(teamId) {
    return this.apiService.invokeDeleteAPI(`${userAdminstration.teams.delete_team}`+teamId);
  }
  addTeamMemebr(teamMemberData) {
    return this.apiService.invokePostAPI(`${userAdminstration.teams.addTeamMemeber}`,teamMemberData);
  }
  deleteTeamMember(memberData) {
    return this.apiService.invokePostAPI(`${userAdminstration.teams.deleteTeamMemeber}`, memberData);
  }
  EditTeam(teamData) {
    return this.apiService.invokePostAPI(`${userAdminstration.teams.teamUpdate}`,teamData);
  }
}
