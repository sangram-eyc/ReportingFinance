import { Inject, Injectable } from '@angular/core';
import { DataManagedSettingsService } from './data-managed-settings.service';
import { EycDataApiService } from './eyc-data-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataManagedService {
  constructor( 
    private dataManagedSettingsService: DataManagedSettingsService,
    private eycDataApiService: EycDataApiService
  ) { }

  getFileSummaryList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list}`);
  }
}
