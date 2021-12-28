import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  validatePermission = (module, task) => {
    const list = JSON.parse(sessionStorage.getItem('permissionList'));
    if (list) {
      if (list.isSuperAdmin) {
        return true;
      } else {
        if (list.features.hasOwnProperty(module)) {
          return list.features[module].indexOf(task) > -1;
        } else {
          return false;
        }
      }
    } else {
      return false
    }
  }

  validateAllPermission = (sessionItemName, module, task) => {
    const list = JSON.parse(sessionStorage.getItem(sessionItemName));
    if (list) {
      if (list.isSuperAdmin) {
        return true;
      } else {
        if (list.features.hasOwnProperty(module)) {
          return list.features[module].indexOf(task) > -1;
        } else {
          return false;
        }
      }
    } else {
      return false
    }
  }
}
