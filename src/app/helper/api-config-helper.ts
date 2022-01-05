import {environment} from '../../environments/environment';

export const userAdminstration = {
    regulatory_Reporting: {
        view_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/users' : environment.apiEndpoint + 'assets/mock/users.json',
        add_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/users.json',
        edit_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        remove_User: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        view_User_Details: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/userInfo.json',
    },
    teams: {
        add_team: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/team' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/team',
        delete_team: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/team/' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/team/',
        teams_list: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/teams' : environment.apiEndpoint + 'assets/mock/teams.json',
        teams_Details: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/teamDetails?teamId=' : environment.apiEndpoint + 'assets/mock/teams.json',
        teamUpdate: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/teamUpdate' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/teamUpdate',
        deleteTeamMemeber: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/removeteamMember' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/removeteamMember',
        addTeamMemeber: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/teamMember' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/teamMember',
        roles: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/roles?module=' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/roles?module=',
        filetypes: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/regreporting/static-data/forms/displayName' : environment.apiEndpoint + 'gatewayService/api/v2/regreporting/static-data/forms/displayName'
    },
    roles: {
        roles_list: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/roleModuleFeatures' : environment.apiEndpoint + 'assets/mock/userroles.json',
        update_roles: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/roleModuleFeatures' : environment.apiEndpoint + 'gatewayService/api/v2/authorization/roleModuleFeatures'
    }
};

export const authorization = {
     auth_Details: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authentication/getDetails' : environment.apiEndpoint + 'assets/mock/auth.json',
     moduleLevelPermission: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/currentUser/modules' : environment.apiEndpoint + 'assets/mock/module_level_permission.json',
     rr_permission_list: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/currentUser/moduleFeatures' : environment.apiEndpoint + 'assets/mock/reg_reporting_permissions.json',
};

export const token_interceptor = {
   
    auth_Header: environment.production ? '/api/v2/authentication/getDetails' : 'assets/mock/auth.json',
    
};