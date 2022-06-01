import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class EntityExceptionDetailsService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getAnswerExceptionReports(filingId, filingName, period, exceptionId, exceptionCnt, componentStage) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_reports}entityId=${filingId}&exceptionId=${exceptionId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}&stage=${componentStage}`);
  }

   exportData(exportData) {
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.view_exception_reports}`,exportData);
  }
  
  /*
  getExceptionResults(exceptionRuleId) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_report_results}exceptionRuleId=${exceptionRuleId}`);
  } */
}
