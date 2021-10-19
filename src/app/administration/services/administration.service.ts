import { Injectable } from '@angular/core';
import { authorization } from '@default/helper/api-config-helper';
import { ApiService } from '@default/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  module;

  constructor(
    private apiService: ApiService
  ) { }

  set setCurrentModule(data) {
    this.module = data;
  }

  get getCurrentModule() {
    return this.module;
  }

  getPermissionsList() {
    return this.apiService.invokeGetAPI(`${authorization.rr_permission_list}?module=Admin`);
  }
}
