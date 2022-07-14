import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class FilingEntityService {

  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  getFilingEntitiesData(){
    return this.apiService.invokeGetAPI(`${this.settingService.filing_entities.filing_entities_list}`);
}


}
