import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  constructor(
    private apiService: ApiSharedService, private settingService: SettingService
  ) { }

  getRolesList(moduleName) {
    return this.apiService.invokeGetAPI(`${this.settingService.roles.roles_list}?module=` + moduleName);
  }

  updateRoles(data) {
    return this.apiService.invokePostAPI(`${this.settingService.roles.update_roles}`, data)
  }
}
