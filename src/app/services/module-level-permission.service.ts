import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { authorization } from '@default/helper/api-config-helper';
import { ApiService } from './api.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleLevelPermissionService {

  @Output() moduleLevelPermisssionDetails = new EventEmitter<any>();
  constructor(
    private apiService: ApiService,
    private settingsService: SettingsService,
    private router: Router
  ) { }

  getModuleLevelPermission() {
    return this.apiService.invokeGetAPI(`${authorization.moduleLevelPermission}`);
  }

  invokeModulePermissionDetails(data){
    this.moduleLevelPermisssionDetails.emit(data);
  }

  checkPermission(module) {
    const permissions = this.settingsService.getModulePermissiongData;
    if(permissions){
      if(permissions.userModules.hasOwnProperty('All')){
        return true;
      } else {
        return permissions.userModules.hasOwnProperty(module);
      }
    } else {
      this.settingsService.logoff();
      return false;
    }
  }

  getPermissionsList() {
    return this.apiService.invokeGetAPI(`${authorization.rr_permission_list}?module=Regulatory Reporting`);
  }

  getPermissionsListByModule(module) {
    return this.apiService.invokeGetAPI(`${authorization.rr_permission_list}?module=${module}`);
  }
}
