import { Injectable } from '@angular/core';
import { userAdminstration } from '@default/helper/api-config-helper';
import { ApiService } from '@default/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  constructor(
    private apiService: ApiService
  ) { }

  getRolesList() {
    return this.apiService.invokeGetAPI(`${userAdminstration.roles.roles_list}`);
  }
}
