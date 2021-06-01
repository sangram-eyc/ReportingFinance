import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {PBI_CONFIG} from '../config/rr-config-helper';
import {EycRrSettingsService} from '../services/eyc-rr-settings.service';
import {EycRrApiService } from '../services/eyc-rr-api.service';

@Injectable({
  providedIn: 'root'
})
export class EycPbiService {
  constructor( private http: HttpClient, private settingService: EycRrSettingsService,
    private apiService: EycRrApiService) {}

  embedToken = (data) => {
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      
    });
  
    return this.http.post(PBI_CONFIG.PBI_EMBED_URL, data, {
      headers: headers,
    });
  }

  getPBIQuestion() {
    return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.question_details}`);
  }

  authToken = () => {
    return this.apiService.invokePostAPI(`${this.settingService.pbiReportingConfig.pbi_auth_token}`);
  }

}
