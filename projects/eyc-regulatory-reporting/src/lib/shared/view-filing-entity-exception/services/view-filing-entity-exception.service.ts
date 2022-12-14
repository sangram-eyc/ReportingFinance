import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ViewFilingEntityExceptionService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getAnswerExceptionReports(entityId, filingName, period, exceptionCnt, componentStage) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.viewFilingEntityException}?entityId=${entityId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}&stage=${componentStage}`);
  }

  exportData(entityId, filingName, period, exceptionCnt, exportsHeader, componentStage) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.viewFilingEntityException}?entityId=${entityId}&filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}&stage=${componentStage}&headers=${exportsHeader}&export=true&reportType=csv`);
  }
}
