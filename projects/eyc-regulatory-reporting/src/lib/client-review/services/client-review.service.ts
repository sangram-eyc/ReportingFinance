import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ClientReviewService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getfilingEntities(filingName, period) {
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.client_review_filing_entities}`);
    // After backend API up will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.client_review_filing_entities}&filingName=${filingName}&period=${period}`);
  }

  approvefilingEntities(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_client_review_filing_entities}`, data);
  }
}
