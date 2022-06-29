import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class DataExplorerService {

  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  getDataExplorerInformation(){
    return this.apiService.invokeGetAPI(`${this.settingService.data_explorer.data_explorer_list}`);
}
}
