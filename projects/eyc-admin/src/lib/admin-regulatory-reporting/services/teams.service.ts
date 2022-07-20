import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})


export class TeamsService {

  TeamsData: any;

  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  set setTeamDetailsData(data) {
    this.TeamsData = data;
  }

  get getTeamDetailsData() {
    return this.TeamsData;
  }

  getTeamsList(moduleName) {
    return this.apiService.invokeGetAPI(`${this.settingService.teams.teams_list}?module=${moduleName}`);
  }

  getTeamsDetails(teamId) {
    return this.apiService.invokeGetAPI(`${this.settingService.teams.teams_Details}?teamId=${teamId}`);
  }

  getRoles(moduleName) {
    return this.apiService.invokeGetAPI(`${this.settingService.teams.roles}`+moduleName);
  }

  getFileType() {
    return this.apiService.invokeGetAPI(`${this.settingService.teams.filetypes}`);
  }

  addTeam(teamData) {
    return this.apiService.invokePostAPI(`${this.settingService.teams.add_team}`,teamData);
  }
  deleteTeam(teamId) {
    return this.apiService.invokeDeleteAPI(`${this.settingService.teams.delete_team}`+teamId);
  }
  addTeamMemebr(teamMemberData) {
    return this.apiService.invokePostAPI(`${this.settingService.teams.addTeamMemeber}`,teamMemberData);
  }
  deleteTeamMember(memberData) {
    return this.apiService.invokePostAPI(`${this.settingService.teams.deleteTeamMemeber}`, memberData);
  }
  EditTeam(teamData) {
    return this.apiService.invokePostAPI(`${this.settingService.teams.teamUpdate}`,teamData);
  }
  exportTeamsData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
  exportTeamsDetailsData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
}