import { AuthConfig } from 'angular-oauth2-oidc';
import {oAuthConfig} from '../services/settings-helpers';

export const MAX_AUTHENTICATION_ATTEMPTS = 3;
export const MIN_PASSWORD_LENGTH = 8;

// local storage and session storage identifiers
export const LOCAL_STORAGE_ID_CURRENT_USER_SESSION = 'currentUserSession';

export const SESSION_TIMEOUT_SECONDS_LENGTH = 60 * 30;
export const SESSION_TIMEOUT_WARNING_SECONDS_LENGTH = 60 * 28;	// when to show warning ratio of total time
export const REFRESHTOKEN_SECONDS_LENGTH = 60 * 20;
export const SESSION_TIMEOUT_WARNING_MESSAGE = 'Your current working session is about to timeout in: ';

export const isEven = (num) => {
	return num % 2 === 0;
};

export const ERROR_USER_SESSION = 'Can\'t get the user session' ;

export enum ENUM_UNIVERSAL_DLGBOX_ACTIONS {
	POSITIVE = 'POSITIVE',   // positive action on dlg box (SUBMIT, YES, TRUE, etc)
	NEGATIVE = 'NEGATIVE'   // negative action on dlg box (cancel, NO, FALSE, etc)
}


// LOGIN HTTP ERRORS
export const ERROR_LOGIN_TEXT = 'Invalid login credentials. Please try again.';
export const ERROR_MOCK_LOGIN_TEXT = 'Invalid MOCK login credentials';
export const ERROR_CRITCAL_ERROR = 'Unknown Error. Please Refresh Or Try Again';
export const SESSION_TIMEOUT_TEXT = 'You have been logged out due to inactivity. Please log in again.';
export const STANDARD_LOGIN = '0';
export const TIMEDOUT_LOGIN = '1';

/**
 * @description All user session store relat
 */
export const STORE_FEATURE_USER_SESSION = 'userLoginSession';

/**
 * TODO_MOM 01-28-18 candidate to promotiion to global helpers
 * utility function to shaLLow copy object
 * @param  {} obj
 * @description returns shallow copy of passed object--usefully to trigger
 * change detection
 */
export const shallowCopyObject = (obj) => {
	return {...obj};
};

export const tmsRole = {
	analyst: 'Analyst',
	xunauthorized: ' Unauthorized'
};

/**
 * get user session from locl storge
 */
export const userSession = (): string => {
	return sessionStorage.getItem(LOCAL_STORAGE_ID_CURRENT_USER_SESSION);
};

/**
 * save user ssession to local storage
 * @param  {ISession} session
 */
export const saveUserSession = (strSession: string) => {
	sessionStorage.setItem(LOCAL_STORAGE_ID_CURRENT_USER_SESSION, strSession);
};

/**
 * delete  user session from local storage
 */
export const deleteUserSession = (): void => {
	sessionStorage.removeItem(LOCAL_STORAGE_ID_CURRENT_USER_SESSION);
};

/**
 * We can get the information needed for AuthConfig from
 * https://login.microsoftonline.com/<YOURTENANT>.onmicrosoft.com/.well-known/openid-configuration
 * and https://login.microsoftonline.com/<YOURTENANT>.onmicrosoft.com/discovery/keys
 */
export const authDetailsModel ={
    loginUrl: "",
    logoutUrl:"",
    redirectUri: "",
    tenant: "",
    silentRefreshRedirectUri: "",
    clientId:"",
    resource:""
}

export const authConfig: AuthConfig = {
	issuer: oAuthConfig.issuer,
	// URL of the SPA to redirect the user to after login
	redirectUri: " ",
	// The SPA's id. The SPA is registerd with this id at the auth-server
	clientId:"",
	// set the scope for the permissions the client should request
	// The first three are defined by OIDC.
	scope: oAuthConfig.scope,
	logoutUrl: "",
	// The auth server's endpoint that allows to log
	// the user in when using implicit flow.
	loginUrl: "",
	// BE resource url
	resource: "",
	responseType:oAuthConfig.responseType,
	clearHashAfterLogin:oAuthConfig.clearHashAfterLogin,
	// URL to redirect to after logout
	postLogoutRedirectUri: oAuthConfig.postLogoutRedirectUri,
	strictDiscoveryDocumentValidation: oAuthConfig.strictDiscoveryDocumentValidation,
	oidc: oAuthConfig.oidc,
	 jwks: {
		keys: [
			{
				kid: oAuthConfig.jwks.keys[0].kid,
				use: oAuthConfig.jwks.keys[0].use,
				kty: oAuthConfig.jwks.keys[0].kty,
				e: oAuthConfig.jwks.keys[0].e,
				n: oAuthConfig.jwks.keys[0].n
			}]
	}, 
	silentRefreshRedirectUri: "",
	siletRefreshTimeout:0,
	timeoutFactor:0.25,
};
