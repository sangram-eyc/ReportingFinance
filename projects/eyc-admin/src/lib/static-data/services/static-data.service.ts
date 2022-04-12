import { EventEmitter, Injectable, Output } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor(
    private apiService: ApiSharedService, private settingService: SettingService
  ) { }

  getStaticData() {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.filing_names}`)
  }

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.static_data_stages}${stageType}`)
  }

  addStaticData(staticData){
    return this.apiService.invokePutAPI(`${this.settingService.static_data.add_static_data}`,staticData);
  }
}
