import {environment} from '../../environments/environment';

export const userAdminstration = {
    regulatory_Reporting: {
        view_User: environment.production ?  environment.SERVICE_URL + 'gatewayService/api/v2/authorization/user/all' : environment.apiEndpoint + 'assets/mock/users.json',
        add_User: environment.production ?  environment.SERVICE_URL + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/users.json',
        edit_User: environment.production ?  environment.SERVICE_URL + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        remove_User: environment.production ? environment.SERVICE_URL + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        view_User_Details: environment.production ?  environment.SERVICE_URL + 'gatewayService/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/users.json',
    }
};

export const authorization = {
     auth_Details: environment.production ? environment.SERVICE_URL + 'authenticationService/api/v2/authentication/getDetails' : environment.apiEndpoint + 'assets/mock/auth.json',
};

export const token_interceptor = {
   
    auth_Header: environment.production ? '/api/v2/authentication/getDetails' : 'assets/mock/auth.json',
    
};
