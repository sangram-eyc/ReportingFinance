
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

  getAnswerExceptionReports(filingName, period, exceptionId, exceptionCnt, componentStage) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_reports}exceptionId=${exceptionId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}&stage=${componentStage}`);
  }

  exportData(exportData) {
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.view_exception_reports}`,exportData);
  }

  exportForDataIntake(exportData) {
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.export_data_for_data_intake}`,exportData);
  }

  getExceptionResults(exceptionRuleId, ruleType, tableName, filename) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.view_exception_report_results}exceptionRuleId=${exceptionRuleId}&ruleType=${ruleType}&secondaryInternalFileName=${filename}&tableName=${tableName}&result_limit=${100}`);
  }
}
