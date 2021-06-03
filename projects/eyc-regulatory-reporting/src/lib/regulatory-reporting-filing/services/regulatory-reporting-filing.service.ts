import { Injectable } from '@angular/core';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import {EycRrApiService} from '../../services/eyc-rr-api.service';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {

  constructor(
    private apiService: EycRrApiService,private settingsService: EycRrSettingsService
  ) { }


  getFilings() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_details}`);
  }
  getFilingsHistory(currentPage,noOfRecords) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}`);
    // After API integration will remove above line and uncomment below line
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}&currentPage=${currentPage}&numRecords=${noOfRecords}`);
  }

  getFilingSearch(noOfRecords) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_search}${noOfRecords}`);
  }

}
