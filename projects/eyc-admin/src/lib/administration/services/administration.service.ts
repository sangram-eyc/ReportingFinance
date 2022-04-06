import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  module;

  constructor(
    private apiService: ApiSharedService, private settingService: SettingService
  ) { }

  set setCurrentModule(data) {
    this.module = data;
  }

  get getCurrentModule() {
    return this.module;
  }

  getPermissionsList() {
    return this.apiService.invokeGetAPI(`${this.settingService.authorization.rr_permission_list}?module=Admin`);
  }

  checkPermission(module) {
    const permissions ={ userModules:""};
    if(permissions){
      if(permissions.userModules.hasOwnProperty('All')){
        return true;
      } else {
        return permissions.userModules.hasOwnProperty(module);
      }
    } else {
  
      return false;
    }
  }
}
