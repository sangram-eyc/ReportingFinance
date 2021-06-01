import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { userAdminstration } from '../../../helper/api-config-helper';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: ApiService) { }

  getUsersList() {
    return this.apiService.invokeGetAPI(`${userAdminstration.regulatory_Reporting.view_User}`);
  }

  addUser(data) {
    return this.apiService.invokePostAPI(`${userAdminstration.regulatory_Reporting.add_User}`, data);
  }

  editUser(userId, formdata) {
    return this.apiService.invokePutAPI(`${userAdminstration.regulatory_Reporting.edit_User}/${userId}`, formdata);
  }

  userDetails(userId) {
    return this.apiService.invokeGetAPI(`${userAdminstration.regulatory_Reporting.view_User_Details}/${userId}`);
  }

  removeUser(userId) {
    return this.apiService.invokeDeleteAPI(`${userAdminstration.regulatory_Reporting.remove_User}/${userId}`);
  }

}
