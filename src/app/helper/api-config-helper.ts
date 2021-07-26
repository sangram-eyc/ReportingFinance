import {environment} from '../../environments/environment';

export const userAdminstration = {
    regulatory_Reporting: {
        view_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user/all' : environment.apiEndpoint + 'assets/mock/users.json',
        add_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/users.json',
        edit_User: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        remove_User: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        view_User_Details: environment.production ?  environment.apiEndpoint + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/userInfo.json',
    },
    teams: {
        teams_list: environment.production ?  environment.apiEndpoint + 'assets/mock/teams.json' : environment.apiEndpoint + 'assets/mock/teams.json',
    }
};

export const authorization = {
     auth_Details: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authentication/getDetails' : environment.apiEndpoint + 'assets/mock/auth.json',
};

export const token_interceptor = {
   
    auth_Header: environment.production ? '/api/v2/authentication/getDetails' : 'assets/mock/auth.json',
    
};
