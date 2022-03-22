import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import {EycRrApiService} from '../../services/eyc-rr-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {
 
  filingData: any;
  @Output() dotcardStatusDetails = new EventEmitter<any>();
  exceptionData: any;
  filingEntityData: any;

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

    set setExceptionData(data) {
      this.exceptionData = data;
    }

    get getExceptionData() {
      return this.exceptionData;
    }

    set setFilingEntityData(data) {
      this.filingEntityData = data;
    }

    get getFilingEntityData() {
      return this.filingEntityData
    }

    getFilings() {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_details}`);
    }
    getFilingsHistory(currentPage,noOfRecords,sort,filter) {
      // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}`);
      // After API integration will remove above line and uncomment below line
      // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}&currentPage=${currentPage}&numRecords=${noOfRecords}`);
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_history}&currentPage=${currentPage}&noOfRecords=${noOfRecords}&sortBy=${sort}&filterKey=${filter}`);
    }
  
    getFilingSearch(noOfRecords) {
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_search}${noOfRecords}`);
    }
  
    getFilingStatus(filingId) {
      // return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_status}`)
    // After API integration will remove above line and uncomment below line
      return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_status}${filingId}/status`)
    }
  
    // getPermissionsList() {
    //   return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.rr_permission_list}`);
    // }

    exportReportsHistory(exportURL) {
      return this.apiService.invokeGetAPI(`${exportURL}`);
  }

  checkFilingCompletedStatus(filingStages:any){
    let statusArr = [...filingStages.status]
    let lastStageIndex = statusArr.length-1;
    return filingStages.status[lastStageIndex].progress === 'COMPLETED' || filingStages.status[lastStageIndex].progress === 'Completed'
  }

}
