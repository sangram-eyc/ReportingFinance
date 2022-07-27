import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey("CompanyName=SHI International Corp._on_behalf_of_Ernst & Young U.S. LLP,LicensedApplication=EY Comply,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=11,LicensedProductionInstancesCount=1,AssetReference=AG-027377,ExpiryDate=23_May_2023_[v2]_MTY4NDc5NjQwMDAwMA==9014b013fefbb0b8e447956ac4272e81"
);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
