import { Component, Inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AdministrationService } from '../services/administration.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit {

  modules = [];
  constructor(
    private router: Router,
    private service: AdministrationService,
  ) { }

  ngOnInit(): void {

    this.service.getPermissionsList().subscribe(res => {
      sessionStorage.setItem('adminPermissionList', JSON.stringify(res['data']));
      if (res['data']['isSuperAdmin']) {
        const permissions =  JSON.parse(sessionStorage.getItem('modules'));
        console.log("permissions", permissions);
        
        if (permissions) {
          console.log("permissions", permissions['userModules']);
          Object.keys(permissions['userModules']).forEach(key => {
            if (key !== "All") {
              this.modules.push({ moduleName: key, moduleId: permissions['userModules'][key] })
            }
          });
        }
      } else {
        Object.keys(res['data']['features']).forEach(key => {
          if (key !== "Default") {
            console.log(this.returnModuleID(key));
            let moduleId = this.returnModuleID(key)
            if (moduleId) {
              this.modules.push({ moduleName: key, moduleId: moduleId })
            }
          }
        });
      }
      console.log(this.modules);

    });

  }

  returnModuleID(moduleName) {
    const permissions = JSON.parse(sessionStorage.getItem('modules'));
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
