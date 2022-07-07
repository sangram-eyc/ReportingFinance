import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  getUsersList(page,size,sort,filter) {
    return this.apiService.invokeGetAPI(`${this.settingService.regulatory_Reporting.view_User}`);
  }
  getAllUsersList() {
    return this.apiService.invokeGetAPI(`${this.settingService.regulatory_Reporting.view_User}`);
  }
  addUser(data) {
    return this.apiService.invokePostAPI(`${this.settingService.regulatory_Reporting.add_User}`, data);
  }

  editUser(userId, formdata) {
    return this.apiService.invokePutAPI(`${this.settingService.regulatory_Reporting.edit_User}/${userId}`, formdata);
  }

  userDetails(userId) {
    return this.apiService.invokeGetAPI(`${this.settingService.regulatory_Reporting.view_User_Details}/${userId}`);
  }

  removeUser(userId) {
    return this.apiService.invokeDeleteAPI(`${this.settingService.regulatory_Reporting.remove_User}/${userId}`);
  }

  exportUsersData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
}
