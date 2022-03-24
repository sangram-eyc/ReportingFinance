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

  getTeamsList(moduleName,page,size,sort,filter) {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.teams_list}?module=${moduleName}&page=${page}&size=${size}&sortBy=${sort}&filterKey=${filter}`);
  }

  getTeamsDetails(teamId,page,size,sort,filter) {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.teams_Details}?page=${page}&filterKey=${filter}&teamId=${teamId}&sortBy=${sort}&size=${size}`);
  }

  getRoles(moduleName) {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.roles}`+moduleName);
  }

  getFileType() {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.filetypes}`);
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
  exportTeamsData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
  exportTeamsDetailsData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
}
