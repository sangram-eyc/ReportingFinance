import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { LicenseManager } from "ag-grid-enterprise";
import * as CryptoJS from 'crypto-js';
import { SESSION_ENCRYPTION_IV, SESSION_ENCRYPTION_KEY } from '@default/services/settings-helpers';

const key = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_KEY);
const iv = CryptoJS.enc.Utf8.parse(SESSION_ENCRYPTION_IV);



var decrypted = CryptoJS.AES.decrypt(environment.AG_KEY, key, {
  keySize: 128 / 8,
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});

LicenseManager.setLicenseKey(decrypted.toString(CryptoJS.enc.Utf8));

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
