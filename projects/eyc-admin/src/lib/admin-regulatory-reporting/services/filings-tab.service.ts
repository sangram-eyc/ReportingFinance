import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class FilingsTabService {

  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  getFilingData(){
    return this.apiService.invokeGetAPI(`${this.settingService.filings_tab.filings_tab_list}`);
  }
}
