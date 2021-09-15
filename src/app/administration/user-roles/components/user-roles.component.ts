import { Component, OnInit } from '@angular/core';
import { UserRolesService } from '../services/user-roles.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  roles: any;
  value = true;
  value1 = true;
  value2 = true;
  selectedPermission: any = {};
  isValidPermission = 0;
  showToastAfterRolesUpdate = false;
  moduleName = "Regulatory Reporting";
  constructor(
    private service: UserRolesService
  ) { }

  ngOnInit(): void {
    this.getRolesList();
  }

  getRolesList() {
    this.service.getRolesList(this.moduleName).subscribe(res => {
      this.roles = res['data'];
      const moduleId = 2;
      for (const property in res['data'].roleModuleFeatures) {
        this.selectedPermission[property] = {
          "moduleFeatureIds": [],
          "moduleId": moduleId,
          "roleName": property
        }
      }
    });
  }

  onChangePermission(event, permission, rolename) {
    if (this.selectedPermission.hasOwnProperty(rolename) && (this.isValidPermission !== 0)) {
      if (this.selectedPermission[rolename]['moduleFeatureIds'].includes(permission.moduleFeatureId)) {
        this.selectedPermission[rolename]['moduleFeatureIds'].splice(this.selectedPermission[rolename]['moduleFeatureIds'].findIndex(item => item === permission.moduleFeatureId), 1);
      } else {
        this.selectedPermission[rolename]['moduleFeatureIds'].push(permission.moduleFeatureId)
      }
    }
  }

  onSave(roleName) {
    this.service.updateRoles(this.selectedPermission[roleName]).subscribe(res => {
      this.showToastAfterRolesUpdate = !this.showToastAfterRolesUpdate;
      setTimeout(() => {
        this.showToastAfterRolesUpdate = !this.showToastAfterRolesUpdate;
      }, 5000);
      this.selectedPermission[roleName]['moduleFeatureIds'] = [];
    });
  }

  // onCancel(roleName) {
  //   for (const property in this.roles['roleModuleFeatures'][roleName]) {
  //     this.roles['roleModuleFeatures'][roleName][property].forEach(element => {
  //       if (this.selectedPermission[roleName]['moduleFeatureIds'].includes(element.moduleFeatureId)) {
  //         element.enabled = !element.enabled;
  //       }
  //     });
  //   }
  //   this.selectedPermission[roleName]['moduleFeatureIds'] = [];
  // }

  openAccord(event, rolename) {
    this.isValidPermission++;
  }

  closeAccord(event, rolename) {
    this.isValidPermission--;
  }
}
