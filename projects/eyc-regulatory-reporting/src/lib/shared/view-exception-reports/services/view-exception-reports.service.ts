
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../../services/eyc-rr-settings.service';




@Injectable({
  providedIn: 'root'
})
export class ViewExceptionReportsService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getAnswerExceptionReports(filingName, period, exceptionName) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_reports}exceptionReport=${exceptionName}&filingName=${filingName}&period=${period}`);
  }

  getExceptionResults() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_report_results}`);
  }
}
