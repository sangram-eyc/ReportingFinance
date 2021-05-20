import {environment} from '../../environments/environment';

export const userAdminstration = {
    regulatory_Reporting: {
        view_User: environment.production ? environment.apiEndpoint + '/api/v2/authorization/user/all' : environment.apiEndpoint + 'assets/mock/users.json',
        add_User: environment.production ? environment.apiEndpoint + '/api/v2/authorization/user' : environment.apiEndpoint + 'assets/mock/users.json',
        edit_User: environment.production ? environment.apiEndpoint + '/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json',
        remove_User: environment.production ? environment.apiEndpoint + '/api/v2/authorization/user' : environment.apiEndpoint + '/assets/mock/users.json'
    }
};
