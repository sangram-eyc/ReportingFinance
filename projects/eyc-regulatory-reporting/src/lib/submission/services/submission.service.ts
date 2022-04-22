
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getXmlFilesList(filingName: any,period: any) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.submission_xml_files}?filing=${filingName}&period=${period}`);
  }

  getXmlFilesListTest(filingName: any, period: any, page, size, filter, sort) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.submission_xml_files}?filing=${filingName}&period=${period}&page=${page}&size=${size}&filterKey=${filter}&sortBy=${sort}`);
  }

  downloadXMl(filesList: any, filingName: any,period: any) {
    return this.apiService.invokePostDownloadAPI(`${this.settingsService.regReportingFiling.submission_download_xml}?filing=${filingName}&period=${period}`, filesList);
    // return this.http.get(this.settingsService.API_ENDPOINT+'assets/eyc-regulatory-reporting/mock/'+id+'.xml',  { headers , responseType: 'blob' as 'json' , observe: 'response' });
  }

  completeFiling(filingId) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.complete_filing}${filingId}/complete`)
  }

  updateStatus(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.updateSubmissionStatus}`, data);
  }

  exportSubmissionData(exportURL) {
       return this.apiService.invokeGetAPI(`${exportURL}`);
  }

  getAuditlog(auditObjectId, auditObjectType) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.audit_log}?auditObjectId=${auditObjectId}&auditObjectType=${auditObjectType}&fetchDetails=true`)
  }
}
