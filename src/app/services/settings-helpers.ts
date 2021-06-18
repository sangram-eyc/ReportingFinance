import {environment} from '../../environments/environment';

export const SESSION_ACCESS_TOKEN= "access_token";
export const SESSION_ENCRYPTION_KEY = '123456$#@$^@1ERF';

export const SESSION_ID_TOKEN= "id_token";
export const ID_ENCRYPTION_KEY = '1234567$#@$^@1ERF';

export const IS_MOCKED_DATA = true;



/**
 * get user session from locl storge
 */
export const userSession = (): string => {
	return sessionStorage.getItem(SESSION_ACCESS_TOKEN);
};

/**
 * save user ssession to local storage
 * @param  {ISession} session
 */
export const saveUserSession = (strSession: string) => {
	sessionStorage.setItem(SESSION_ACCESS_TOKEN, strSession);
};

/**
 * delete  user session from local storage
 */
export const deleteUserSession = (): void => {
	sessionStorage.removeItem(SESSION_ACCESS_TOKEN);
};

/**
 * configuration to set the auth header
 */

export const ACCESS_TOKEN= true;
export const ID_TOKEN = true;
export const USER_NAME = true;
export const NONCE = true;
export const SESSION_ID = true;
export const UUID = true;
/**
 * configuration to set the auth header
 */

 /**
 * configuration to set the login page for user 
 */

export const EYC_LOGIN = false;

/**
 * configuration to set the login page for user 
 */


export const oAuthConfig = {
	issuer: 'https://sts.windows.net/5b973f99-77df-4beb-b27d-aa0c70b8482c/',
	scope: 'openid profile email',
	responseType:"token id_token",
	resource: 'https://graph.microsoft.com',
	postLogoutRedirectUri: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/logout',
	strictDiscoveryDocumentValidation: false,
	clearHashAfterLogin: false,
	oidc: true,
	jwks: {
		  keys: [
			  {
				  kid: 'nbCwW11w3XkB-xUaXwKRSLjMHGQ',
				  use: 'sig',
				  kty: 'RSA',
				  e: 'AQAB',
				  n: 'u98KvoUHfs2z2YJyfkJzaGFYM58eD0epHfETTwNDl6AL_cTfOklcxM4jrLWvVqqp2sHaH0gFpYPyovN-_akmE_4fkc0Vw_wGM5jDP-jnOJ1vBvbFoF7uBAy4r3ln2ey1PoGUhpkXdDawhIfdAbc7WLtyopHNWQXI336rXiwjvcjL8dHhievDOktsAsilADP5wJT0lyTifONPZOq-XWCw9FtXAQr7DniOC5uDuUaL0mM1UJChiCrDmFOAf6CNdu2SwLinXYauqM9ORElKYEChoEfi51fcsmlsn4mtNPkxstvR7OJiJBpvk7FLeiaBtMnsO5x30DPgrhAagrVn3IaKRQ'
			  }]
	  },
	  
  }
  
  /**
 * configuration to set the user admin module
 */

export const IS_USER_DETAILS_EDITABLE = true;


  /**
 * configuration to set the input validation
 */

export const INPUT_VALIDATION = /[A-Za-z0-9\ ]+/;

 /**
 * configuration to decrypt pbi token
 */
export const SESSION_PBI_TOKEN= "pbi_token";
export const PBI_ENCRYPTION_KEY = '123456$#@$^@1PBI';