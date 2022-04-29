import { Inject, Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';


@Injectable({
  providedIn: 'root'
})
export class DataIntakeService {

  constructor(private apiService: EycRrApiService, private settingsService: EycRrSettingsService, @Inject('mockDataEnable') private mockDataEnable) { }

  getExceptionReports(filingName, period, page, size, filter, sort) {
    if(this.mockDataEnable) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_exception_reports}`);
    } else {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_exception_reports}filingName=${filingName}&period=${period}&page=${page}&size=${size}&filterKey=${filter}&sortBy=${sort}`);
    }
    // After backend API up will remove above line and uncomment below line
  }
  
  getfilingEntities(filingName, period) {
     return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_files}`);
    // After backend API up will remove above line and uncomment below line
   
  }
  getfilesList(filingName, period) {
    if(this.mockDataEnable) {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.exception_summary}`);
    } else {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.exception_summary}filingName=${filingName}&period=${period}`);
    }
  }

  getBDFilesList(filingName, lastFileDueDate, period) {
    if(this.mockDataEnable) {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.bd_files_list}`);
    } else {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.bd_files_list}filingName=${filingName}&lastFileDueDate=${lastFileDueDate}&period=${period}`);
    }
  }

  getDatasetsrecords(filingName, period, page, size, filter, sort) {
    if(this.mockDataEnable) {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.datasets_list}`);
    } else {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.datasets_list}filingName=${filingName}&period=${period}&page=${page}&size=${size}&filterKey=${filter}&sortBy=${sort}`);
    }
  }

  getComments(type, id) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_comments}`);
  }
 
  approveExceptionReports(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_intake_exception_report}`, data);
  }
  exportIntakeData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }

  markDatantakeComplete(filingName, period, stage){    
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.mark_intake_complete}complete?filingName=${filingName}&period=${period}&stage=${stage}`)
  }
}
