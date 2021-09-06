import { EventEmitter, Injectable, Output } from '@angular/core';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { EycApiService } from '../../services/eyc-tax-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementReportsService {

  filingData: any;
 


  constructor(
    private apiService: EycApiService, private settingsService: EycTaxSettingsService
  ) { }

  reportsData() {
    return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.management_report}`);
  }

}