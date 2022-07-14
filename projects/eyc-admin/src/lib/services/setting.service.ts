import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(@Inject('apiEndpoint') private apiEndpoint, @Inject('rrproduction') private rrproduction,
    @Inject('taxapiEndpoint') private taxApiEndpoint, @Inject('taxProduction') private taxproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;

  public production = this.rrproduction;

  get regulatory_Reporting(): any {
    const regulatory_Reporting = {
      view_User: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/users' : this.API_ENDPOINT + 'assets/mock/users.json',
      add_User: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/user' : this.API_ENDPOINT + 'assets/mock/users.json',
      edit_User: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/user' : this.API_ENDPOINT + '/assets/mock/users.json',
      remove_User: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/user' : this.API_ENDPOINT + '/assets/mock/users.json',
      view_User_Details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/user' : this.API_ENDPOINT + 'assets/mock/userInfo.json',
    }
    return regulatory_Reporting
  };

  get teams(): any {
    const teams = {
      add_team: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/team' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/team',
      delete_team: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/team/' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/team/',
      teams_list: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teams' : this.API_ENDPOINT + 'assets/mock/teams.json',
      teams_Details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teamDetails' : this.API_ENDPOINT + 'assets/mock/team_details.json',
      teamUpdate: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teamUpdate' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teamUpdate',
      deleteTeamMemeber: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/removeteamMember' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/removeteamMember',
      addTeamMemeber: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teamMember' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/teamMember',
      roles: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/roles?module=' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/roles?module=',
      filetypes: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/forms' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/forms'
    }
    return teams;
  };


  get roles(): any {
    const roles = {
      roles_list: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/roleModuleFeatures' : this.API_ENDPOINT + 'assets/mock/userroles.json',
      update_roles: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/roleModuleFeatures' : this.API_ENDPOINT + 'gatewayService/api/v2/authorization/roleModuleFeatures'
    }
    return roles;
  }

  get static_data(): any {
    const static_data = {
      filing_names: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/forms/displayName' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/forms/displayName',
      static_data_stages: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/stages/' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/stages/',
      add_static_data: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/stages' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/stages',
      get_static_data_details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/form/' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/form/',
      pbi_mapping: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/form/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_mapping.json',
      pbi_question_list: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/questions' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/questions',
      add_pbi_mapping: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/pbi-mapping' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/pbi-mapping',
      delete_pbi_mapping: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/pbi-mapping' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/pbi-mapping',
      filing_frequencies : this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/filing/frequencies' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/filing/frequencies',
    }
    return static_data;
  }

  get task_assignment(): any {
    const task_assignment = {
      tasks_assignment_list: this.rrproduction ? this.API_ENDPOINT + 'assets/mock/taskAssignment.json' : this.API_ENDPOINT + 'assets/mock/taskAssignment.json',
    }
    return task_assignment;
  }

  get authorization(): any{
    const authorization = {
      auth_Details: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authentication/getDetails' : this.API_ENDPOINT + 'assets/mock/auth.json',
      moduleLevelPermission: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/currentUser/modules' : this.API_ENDPOINT + 'assets/mock/module_level_permission.json',
      rr_permission_list: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/authorization/currentUser/moduleFeatures' : this.API_ENDPOINT + 'assets/mock/reg_reporting_permissions.json',
  }
  return authorization;
  }

  get data_explorer(): any{
    const data_explorer = {
      data_explorer_list: this.rrproduction ? this.API_ENDPOINT + 'assets/mock/taskAssignment.json' : this.API_ENDPOINT + 'assets/mock/taskAssignment.json',
    }
    return data_explorer;
  }

  get filing_entities(): any{
    const filing_entities = {
      filing_entities_list: this.rrproduction ? this.API_ENDPOINT + 'assets/mock/filingEntities.json' : this.API_ENDPOINT + 'assets/mock/filingEntities.json',
    }
    return filing_entities;
  }
  
  get filings_tab(): any{
    const data_explorer = {
      filings_tab_list: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/static-data/forms' : this.API_ENDPOINT + 'assets/mock/filingsTableData.json',
    }
    return data_explorer;
  }
}
