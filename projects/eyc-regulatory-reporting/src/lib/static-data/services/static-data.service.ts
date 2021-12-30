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

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.static_data_stages}${stageType}`)
  }

  addStaticData(staticData){
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.add_static_data}`,staticData);
  }
}
