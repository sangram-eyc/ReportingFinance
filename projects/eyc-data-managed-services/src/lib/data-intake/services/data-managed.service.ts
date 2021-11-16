import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DataManagedSettingsService } from './data-managed-settings.service';
import { EycDataApiService } from './eyc-data-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagedService {
  constructor(
    private httpClient: HttpClient,
    private dataManagedSettingsService: DataManagedSettingsService,
    private eycDataApiService: EycDataApiService
  ) { }

  getFileSummaryList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list}`);
  }

  getDailyFileSummaryList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list_daily}`);
  }

  getMonthlyFileSummaryList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list_monthly}`);
  }

  getDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider}`);
  }

  getDailyDataProviderList(){
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_daily}`);
  }

  getMonthlyDataProviderList(){
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_monthly}`);
  }

  general(){
    return this.httpClient.get('assets/eyc-data-intake/mock/data.json')
  }

}
