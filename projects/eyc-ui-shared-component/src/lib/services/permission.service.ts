import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  validatePermission = (module, task) => {
    const list = JSON.parse(sessionStorage.getItem('permissionList'));
    return list[module].indexOf(task) > -1;
  }

}
