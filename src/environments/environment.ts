// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiEndpoint : 'http://localhost:4200',
  production: false,
  AUTH_TYPE: 'OAUTH'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

export const oAuthConfig = {
  sso_type:"AzureAD",
  
  loginUrl: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/authorize',
  logoutUrl: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/logout',
  redirectUri: 'http://localhost:4200/assets/redirect.html',
 // redirectUri: 'http://localhost:4200',
  tenant:"5b973f99-77df-4beb-b27d-aa0c70b8482c",
  silentRefreshRedirectUri: 'http://localhost:4200/silent-refresh.html',
  issuer: 'https://sts.windows.net/5b973f99-77df-4beb-b27d-aa0c70b8482c/',
  scope: 'openid profile email',
  //clientId: '3c652dbf-0b03-4537-b49c-14070a9b60db',
  clientId: 'b08471aa-d4f4-4d1c-a0a8-0e976a575dff',
  //resource: 'api://7e43da3b-2c84-426b-8e5a-1e3ef0ee8b42',
  responseType:"token id_token",
  resource: 'https://graph.microsoft.com',
  postLogoutRedirectUri: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/logout',
  strictDiscoveryDocumentValidation: false,
  clearHashAfterLogin: true,
  oidc: true,
  jwks: {
		keys: [
			{
				kid: 'nbCwW11w3XkB-xUaXwKRSLjMHGQ',
				use: 'sig',
				kty: 'RSA',
				e: 'AQAB',
				// tslint:disable-next-line:max-line-length
				n: 'u98KvoUHfs2z2YJyfkJzaGFYM58eD0epHfETTwNDl6AL_cTfOklcxM4jrLWvVqqp2sHaH0gFpYPyovN-_akmE_4fkc0Vw_wGM5jDP-jnOJ1vBvbFoF7uBAy4r3ln2ey1PoGUhpkXdDawhIfdAbc7WLtyopHNWQXI336rXiwjvcjL8dHhievDOktsAsilADP5wJT0lyTifONPZOq-XWCw9FtXAQr7DniOC5uDuUaL0mM1UJChiCrDmFOAf6CNdu2SwLinXYauqM9ORElKYEChoEfi51fcsmlsn4mtNPkxstvR7OJiJBpvk7FLeiaBtMnsO5x30DPgrhAagrVn3IaKRQ'
			}]
	},
	
}
