export const environment = {
  apiEndpoint : '.',
  production: true,
  SECURITY_ENABLED:true,
};

export const oAuthConfig = {
  sso_type:"AzureAD",
  
  loginUrl: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/authorize',
  logoutUrl: 'https://login.microsoftonline.com/5b973f99-77df-4beb-b27d-aa0c70b8482c/oauth2/logout',
  redirectUri: 'https://10.48.234.20/qa31/assets/redirect.html',
 // redirectUri: 'http://localhost:4200',
  tenant:"5b973f99-77df-4beb-b27d-aa0c70b8482c",
  silentRefreshRedirectUri: 'https://10.48.234.20/qa31/silent-refresh.html',
  issuer: 'https://sts.windows.net/5b973f99-77df-4beb-b27d-aa0c70b8482c/',
  scope: 'openid profile email',
  //clientId: '3c652dbf-0b03-4537-b49c-14070a9b60db',
  clientId: 'b08471aa-d4f4-4d1c-a0a8-0e976a575dff',
  //resource: 'api://7e43da3b-2c84-426b-8e5a-1e3ef0ee8b42',
  silentRefreshTimeout: environment.production ? 5000 : 5000,
  timeoutFactor: environment.production ? 0.25 : 0.1,
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
				// tslint:disable-next-line:max-line-length
				n: 'u98KvoUHfs2z2YJyfkJzaGFYM58eD0epHfETTwNDl6AL_cTfOklcxM4jrLWvVqqp2sHaH0gFpYPyovN-_akmE_4fkc0Vw_wGM5jDP-jnOJ1vBvbFoF7uBAy4r3ln2ey1PoGUhpkXdDawhIfdAbc7WLtyopHNWQXI336rXiwjvcjL8dHhievDOktsAsilADP5wJT0lyTifONPZOq-XWCw9FtXAQr7DniOC5uDuUaL0mM1UJChiCrDmFOAf6CNdu2SwLinXYauqM9ORElKYEChoEfi51fcsmlsn4mtNPkxstvR7OJiJBpvk7FLeiaBtMnsO5x30DPgrhAagrVn3IaKRQ'
			}]
	},
	
}

