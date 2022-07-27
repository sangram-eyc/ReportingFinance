// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  apiEndpoint: 'http://localhost:4200/',
  production: true,
  SECURITY_ENABLED: true,
  SERVICE_URL: "https://10.48.234.20/qa32/",
  /*temp variable needs to be removed after API integration */
  //AUTH_PROD:true,
  AG_License_KEY : "CompanyName=SHI International Corp._on_behalf_of_Ernst & Young U.S. LLP,LicensedApplication=EY Comply,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=11,LicensedProductionInstancesCount=1,AssetReference=AG-027377,ExpiryDate=23_May_2023_[v2]_MTY4NDc5NjQwMDAwMA==9014b013fefbb0b8e447956ac4272e81"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

