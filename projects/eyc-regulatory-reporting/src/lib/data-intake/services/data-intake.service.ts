import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';


@Injectable({
  providedIn: 'root'
})
export class DataIntakeService {

  constructor(private apiService: EycRrApiService, private settingsService: EycRrSettingsService) { }

  getExceptionReports(filingName, period) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_exception_reports}filingName=${filingName}&period=${period}`);
    // After backend API up will remove above line and uncomment below line
  }
  
  getfilingEntities(filingName, period) {
     return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_files}`);
    // After backend API up will remove above line and uncomment below line
   
  }
  getfilesList(filingName, period) {
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.files_list}`);
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.exception_summary}filingName=${filingName}&period=${period}`);
  }

  getBDFilesList(filingName, lastFileDueDate, period) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.bd_files_list}filingName=${filingName}&lastFileDueDate=${lastFileDueDate}&period=${period}`);
  }

  getDatasetsrecords() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.datasets_list}`);
  }

  getComments(type, id) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_comments}`);
  }
 
  approveExceptionReports(data) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.approve_intake_exception_report}`, data);
  }
}
