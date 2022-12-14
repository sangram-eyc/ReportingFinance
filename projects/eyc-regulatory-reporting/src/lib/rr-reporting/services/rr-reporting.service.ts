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

  getExceptionReports(filingName, period, stage) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_exception_reports}filingName=${filingName}&period=${period}&stage=${stage}`);
  }

  getfilingEntities(filingName, period) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_filing_entities}&filingName=${filingName}&period=${period}`);
  }

  approvefilingEntities(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_rr_filing_entities}`, data);
  }

  unApprovefilingEntities(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.filing_unapprove}`, data);
  }

  approveAnswerExceptions(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_answer_exceptions}`, data);
  }

  unApproveAnswerExceptions(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.filing_unapprove}`, data);
  }

  getComments(type, id) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_comments}`);
  }
  exportRRData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }

  getAuditlog(auditObjectId, auditObjectType) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.audit_log}?auditObjectId=${auditObjectId}&auditObjectType=${auditObjectType}&fetchDetails=true`);
  }
}
