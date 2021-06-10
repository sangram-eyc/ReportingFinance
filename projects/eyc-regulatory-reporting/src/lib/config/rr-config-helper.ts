
export const PBI_CONFIG = {
    PBI_USER_NAME: 'eycomply-gs-qa-master@eymsprod.onmicrosoft.com',
    PBI_PASSWORD: 'DiW*j2KeIoB#',
    PBI_WORK_SPACE_ID: '4c4f5af3-ab5a-44c0-8fe9-533e75e8a324',
    PBI_CLIENT_ID:'2b496842-de6d-4993-a955-f4ccb5d8a22e',
    PBI_EMBED_URL:'https://app.powerbi.com/reportEmbed',
    PBI_AUTH_CTX_URL:'https://login.windows.net/common',
    PBI_TOKEN_URL:'https://analysis.windows.net/powerbi/api',
    PBI_API_URL:'https://api.powerbi.com/v1.0/myorg/',
    adalConfig: {
        tenant: '5b973f99-77df-4beb-b27d-aa0c70b8482c', //tenant id of your organization
        clientId: 'b08471aa-d4f4-4d1c-a0a8-0e976a575dff', // client id of your azure ad application
        //cacheLocation: 'localStorage', // Default is sessionStorage
        redirectUri:`${window.location.origin}/`    ,
        popUp: false    
      }
};

export const INPUT_VALIDATON_CONFIG = {
 SEARCH_INPUT_VALIDATION:/[A-Za-z0-9\-\_/ ]+/,
}

/*PBI Theme file settings */
export const IS_THEME_APPLIED = true;
export const IS_FY_FILTER = true;
export const IS_PERIOD_FILTER = true;
export const SESSION_PBI_TOKEN= "pbi_token";
export const PBI_ENCRYPTION_KEY = '123456$#@$^@1PBI';


/*PBI Theme file settings */

