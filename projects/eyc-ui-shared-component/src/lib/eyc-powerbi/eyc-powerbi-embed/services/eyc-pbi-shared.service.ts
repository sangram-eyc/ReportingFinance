import { Injectable } from '@angular/core';
import {PBI_CONFIG} from '../config/rr-config-helper';
import {EycRrSettingsService} from '../services/eyc-rr-settings.service';
import {EycRrApiService } from '../services/eyc-rr-api.service';

@Injectable({
  providedIn: 'root'
})
export class EycPbiSharedService {

  constructor(private settingService: EycRrSettingsService,
    private apiService: EycRrApiService) { }

  embedToken = (data) => {
    return this.apiService.invokePostAPI(`${this.settingService.pbiReportingConfig.pbi_embeded_token}${data}`);
  }
  authToken = () => {
    return this.apiService.invokePostAPI(`${this.settingService.pbiReportingConfig.pbi_auth_token}`);
  }

}
