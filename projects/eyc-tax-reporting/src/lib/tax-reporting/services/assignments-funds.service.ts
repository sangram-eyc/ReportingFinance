import { Injectable } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsFundsService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }

  listUserToAdd() {
    if(this.settingsService.production){
      //temp when api is ready      
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.list_users_to_add}`);
    }
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.list_users_to_add}`);
    }
  }
}
