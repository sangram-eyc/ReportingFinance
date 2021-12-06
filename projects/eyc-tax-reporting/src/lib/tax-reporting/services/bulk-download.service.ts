import { Injectable } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class BulkDownloadService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }

  bulkDownloadFirstCall(data:any){

    if(this.settingsService.production){    
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.bulk_download_service1}`, data);    
    }
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.bulk_download_service1}`);
    }
  }
}
