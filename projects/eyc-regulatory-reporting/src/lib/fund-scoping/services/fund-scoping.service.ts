import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class FundScopingService {

  constructor(
    private http: HttpClient,
    private apiService: EycRrApiService,
    private settingsService: EycRrSettingsService,
  ) { }

  // getFilingFunds() {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http.get(this.settingsService.API_ENDPOINT+'assets/eyc-regulatory-reporting/mock/filingFunds.json', {
  //     headers
  //   });
  // }

  getFundScopingDetails(filingStatus,filingName, period) {
  //  return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.fund_scoping_details}`);
    // After backend API up will remove above line and uncomment below line
     return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.fund_scoping_details}&fundScopingFilingStatus=${filingStatus}&filingName=${filingName}&period=${period}`);
  }

  getFundScopingStatus(filingId) {
  //  return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.fund_scoping_status}`);
    // After backend API up will remove above line and uncomment below line
     return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.fund_scoping_status}&filingId=${filingId}`);
  }

  exportScopeData(exportURL) {
    //  return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.fund_scoping_status}`);
      // After backend API up will remove above line and uncomment below line
       return this.apiService.invokeGetAPI(`${exportURL}`);
    }

  approveFundScopingStatus(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_fund_scoping_status}`, data);
  }

}
