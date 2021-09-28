import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import {IS_SURE_FOOT} from '../../services/settings-helpers';
import { AdministrationService } from '../services/administration.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

is_Tax_Reporting = IS_SURE_FOOT;
  modules = [];
  constructor(
    private router: Router,
    private service: AdministrationService,
    public moduleLevelPermission: ModuleLevelPermissionService
  ) { }

  ngOnInit(): void {

    console.log(this.moduleLevelPermission.checkPermission('All'));
    if(!this.moduleLevelPermission.checkPermission('All')) {
      this.service.getPermissionsList().subscribe(res => {
        console.log(res);
        sessionStorage.setItem('adminPermissionList', JSON.stringify(res['data']['features']));
        Object.keys(res['data']['features']).forEach(key => {
          if(key !== "Default"){
            console.log(this.returnModuleID(key));
            let moduleId = this.returnModuleID(key)
            if(moduleId){
              this.modules.push({moduleName: key, moduleId: moduleId})
            }
            console.log(key, res['data']['features'][key]);
          }
        });
        console.log(this.modules);
        
      });
    } else {
      const permissions = JSON.parse(sessionStorage.getItem('moduleLevelPermission'));
      if (permissions) {
        console.log("permissions",permissions['userModules']);
        Object.keys(permissions['userModules']).forEach(key => {
          if(key !== "All"){
          this.modules.push({moduleName: key, moduleId: permissions['userModules'][key]})
          }
        });
      }
      // this.modules = [
      //   {moduleName: 'Regulatory Reporting', moduleId: 2},
      //   {moduleName: 'Tax Reporting', moduleId: 4},
      //   {moduleName: 'Data Intake', moduleId: 3},
      //   {moduleName: 'Admin', moduleId: 1}
      // ];
    }
    
  }

  returnModuleID(moduleName) {
    const permissions = JSON.parse(sessionStorage.getItem('moduleLevelPermission'));
    if (permissions) {
      if (permissions.userModules.hasOwnProperty(moduleName)) {
        console.log(permissions.userModules);

        return permissions.userModules[moduleName];
      }
    }

  }

  routeAdminRR(){
    this.service.module = 'Regulatory Reporting';
    this.router.navigate(['/admin-dashboard']);
  }


  routeAdmin(module) {
    //should use this generic method for future modules
    this.service.setCurrentModule = module;
    this.router.navigate(['/admin-dashboard']);
  }

 

}
