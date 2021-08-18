import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {PBI_CONFIG} from '../config/tax-config-helper';
import {EycTaxSettingsService} from '../services/eyc-tax-settings.service';
import {EycRrApiService } from '../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class EycPbiService {
  constructor( private http: HttpClient, private settingService: EycTaxSettingsService,
    private apiService: EycRrApiService) {}

  embedToken = (data) => {
    return this.apiService.invokePostAPI(`${this.settingService.pbiReportingConfig.pbi_embeded_token}${data}`);
  }

  getPBIQuestion(filingId) {
    //return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.question_details}`);
    // After API are ready will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.question_details}${filingId}`);
  }

  authToken = () => {
    return this.apiService.invokePostAPI(`${this.settingService.pbiReportingConfig.pbi_auth_token}`);
  }

  getFilingNames() {
    return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.filing_names}`)
  }

  getPeriods(filingName) {
  //  return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.period}`)
    // After API are ready will remove above line and uncomment below line
   return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.period}${filingName}/period`)
  }

  getPBIReportIDByFilingIdQuestionId(filingId,questionId) {
    //return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.PBIReportId}`)
    // After API are ready will remove above line and uncomment below line
     return this.apiService.invokeGetAPI(`${this.settingService.pbiReportingConfig.PBIReportId}${filingId}/${questionId}`)
  }

}
