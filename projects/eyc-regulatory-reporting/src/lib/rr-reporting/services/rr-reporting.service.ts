import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class RrReportingService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getExceptionReports(filingName, period) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_exception_reports}filingName=${filingName}&period=${period}`);
    // After backend API up will remove above line and uncomment below line
  }

  getfilingEntities(filingName, period) {
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_filing_entities}`);
    // After backend API up will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_filing_entities}&filingName=${filingName}&period=${period}`);
  }

  approvefilingEntities(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_rr_filing_entities}`, data);
  }

  getComments(type, id) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_comments}`);
  }
}
