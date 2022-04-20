import {environment} from '@env/environment';


export const authorization = {
    auth_Details: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authentication/getDetails' : environment.apiEndpoint + 'assets/mock/auth.json',
    moduleLevelPermission: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/currentUser/modules' : environment.apiEndpoint + 'assets/mock/module_level_permission.json',
    rr_permission_list: environment.production ? environment.apiEndpoint + 'gatewayService/api/v2/authorization/currentUser/moduleFeatures' : environment.apiEndpoint + 'assets/mock/reg_reporting_permissions.json',
};

export const notification = {
  archived_Notifications: environment.production ? environment.apiEndpoint + 'gatewayService/api/notification?isArchived=true' : environment.apiEndpoint + 'gatewayService/api/notification?isArchived=true',
  no_Archived_Notifications: environment.production ? environment.apiEndpoint + 'gatewayService/api/notification?isArchived=false' : environment.apiEndpoint + 'gatewayService/api/notification?isArchived=false',
  export_Archived_Csv: environment.production ? environment.apiEndpoint + 'gatewayService/api/notification/csv?isArchived=true' : environment.apiEndpoint + 'gatewayService/api/notification/csv?isArchived=true',
}

export const token_interceptor = {

   auth_Header: environment.production ? '/api/v2/authentication/getDetails' : 'assets/mock/auth.json',

};

export const notifier_ws = environment.production ? 'wss://10.48.234.20/qa35/notifierAgentService/ws-notifier-agent-communication': 'https://127.0.0.1:8081/notifierAgentService/ws-notifier-agent-communication';

