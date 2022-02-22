
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

  getAnswerExceptionReports(filingName, period, exceptionId, exceptionCnt) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_reports}exceptionId=${exceptionId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}`);
  }

  exportData(filingName, period, exceptionId, exceptionCnt, exportsHeader) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_reports}exceptionId=${exceptionId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}&headers=${exportsHeader}&export=true&reportType=csv`);
  }

  getExceptionResults(exceptionRuleId) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_report_results}exceptionRuleId=${exceptionRuleId}`);
  }
}
