import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';
import {EycRrApiService} from '../../services/eyc-rr-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor(
    private apiService: EycRrApiService,private settingsService: EycRrSettingsService
  ) { }

  getStaticData() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_names}`)
  }
  filingStages() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.filing_stages}`)
  }
  scopingStages() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.scoping_stages}`)
  }
  entityStages() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.entity_stages}`)
  }
}
