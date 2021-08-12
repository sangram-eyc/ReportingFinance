import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycRrSettingsService} from '../../services/eyc-tax-settings.service';
import {EycRrApiService} from '../../services/eyc-tax-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {
 
  filingData: any;
  @Output() dotcardStatusDetails = new EventEmitter<any>();


  constructor(
    private apiService: EycRrApiService,private settingsService: EycRrSettingsService
  ) { }

    invokeFilingDetails(){
      this.dotcardStatusDetails.emit()
    }

    set setfilingData(data) {
      this.filingData = data;
    }

    get getFilingData() {
      return this.filingData;
    }

  getFilings() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_details}`);
  }
  getFilingsHistory(currentPage,noOfRecords) {
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}`);
    // After API integration will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}&currentPage=${currentPage}&numRecords=${noOfRecords}`);
  }

  getFilingSearch(noOfRecords) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_search}${noOfRecords}`);
  }

  getFilingStatus(filingId) {
    // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_status}`)
  // After API integration will remove above line and uncomment below line
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_status}${filingId}/status`)
  }

}
