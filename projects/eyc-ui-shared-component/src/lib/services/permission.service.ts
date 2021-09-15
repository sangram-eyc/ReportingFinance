import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  validatePermission = (module, task) => {
    const permissions = JSON.parse(sessionStorage.getItem('moduleLevelPermission'));
    if (permissions) {
      if (permissions.userModules.hasOwnProperty('All')) {
        return true;
      } else {
        const list = JSON.parse(sessionStorage.getItem('permissionList'));
        if (list) {
          if (list.hasOwnProperty(module)) {
            return list[module].indexOf(task) > -1;
          } else {
            return false;
          }
        } else {
          return false
        }
      }
    }
  }

}
