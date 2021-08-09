import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';


@Injectable({
  providedIn: 'root'
})
export class DataIntakeService {

  constructor(private apiService: EycRrApiService, private settingsService: EycRrSettingsService) { }

  getExceptionReports(filingName, period) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_exception_reports}`);
    // After backend API up will remove above line and uncomment below line
  }
  
  getfilingEntities(filingName, period) {
     return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.di_files}`);
    // After backend API up will remove above line and uncomment below line
   
  }
}
