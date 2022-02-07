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

  getAnswerExceptionReports(entityName, filingName, period, exceptionCnt) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.viewFilingEntityException}${entityName}/exception-details?filingName=${filingName}&period=${period}&totalExceptions=${exceptionCnt}`);
  }
}
