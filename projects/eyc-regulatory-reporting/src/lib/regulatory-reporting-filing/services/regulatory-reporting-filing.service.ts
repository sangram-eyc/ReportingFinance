import { Injectable } from '@angular/core';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import {EycRrApiService} from '../../services/eyc-rr-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {
  private filingDataSubject = new BehaviorSubject(null);
  filingData = this.filingDataSubject.asObservable();

  private filingStatusSubject = new BehaviorSubject(null);
  filingStatus = this.filingStatusSubject.asObservable();

  constructor(
    private apiService: EycRrApiService,private settingsService: EycRrSettingsService
  ) { }

  addFilingData(data){
    this.filingDataSubject.next(data);
  }

  addfilingStatus(data){
    this.filingStatusSubject.next(data);
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
