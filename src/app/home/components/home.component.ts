import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { IS_SURE_FOOT, SESSION_ID_TOKEN, HIDE_HOME_PAGE } from '../../services/settings-helpers';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  moduleLevelPermissionData: any;
  constructor(
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private moduleLevelPermission: ModuleLevelPermissionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
      this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
    }

    this.moduleLevelPermission.getModuleLevelPermission().subscribe(res => {
      this.moduleLevelPermissionData = res['data'];
      if (!res['data']) {
        this.openErrorModal("Access Denied", "User is not a valid user. Please contact an administrator.");
      }
      // else if (!res['data']['userDetails'].isActive) {
      //   this.openErrorModal("Access Denied", "User is not a active user. Please contact an administrator.");
      // }
      else if (res['data']['userModules'] && Object.keys(res['data']['userModules']).length === 0 && res['data']['userModules'].constructor === Object) {
        this.openErrorModal("Access Denied", "User does not have access to any module. Please contact an administrator.");
      } else {
        sessionStorage.setItem("moduleLevelPermission", JSON.stringify(res['data']));
        this.moduleLevelPermission.invokeModulePermissionDetails();
        if (!res['data'].userModules.hasOwnProperty('All')) {
          if (res['data'].userModules.hasOwnProperty('Regulatory Reporting')) {
            this.permissionList();
          } else {
            this.navigation();  
          }
        } else {
          this.navigation();
        }
      }
    });
  }

  permissionList() {
    if (sessionStorage.getItem("permissionList") === null) {
      this.moduleLevelPermission.getPermissionsList().subscribe(resp => {
        this.navigation();
        const userEmail = sessionStorage.getItem('userEmail');
        if (userEmail.endsWith('ey.com')) {
          sessionStorage.setItem("permissionList", JSON.stringify(resp.data.features));
        } else if (userEmail.indexOf('myeyazure.ping0448@eys') !== -1 || userEmail.indexOf('myeyazure.ping0445@eys') !== -1) {
          sessionStorage.setItem("permissionList", JSON.stringify(resp.data.features));
        } else {
          resp.data.features.intake.splice(5, 2);
          resp.data.features.reporting.shift();
          sessionStorage.setItem("permissionList", JSON.stringify(resp.data.features));
        }
      });
    } else {
      this.navigation();
    }
  }

  navigation() {
    if (IS_SURE_FOOT) {
      this.router.navigate(['/app-tax-reporting'])
    }
    else {
      console.log(this.moduleLevelPermissionData.userModules);
      if (this.moduleLevelPermissionData.userModules.hasOwnProperty('All')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-regulatory-filing']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Regulatory Reporting')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-regulatory-filing']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Tax Reporting')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-tax-reporting']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Data Intake')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/data-intake-landing']);

      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    if (!this.moduleLevelPermissionData) {
      setTimeout(() => {
        dialogRef.close();
      }, 30000);
    }
    dialogRef.afterClosed().subscribe(result => {
      this.settingsService.logoff();
      this.router.navigate(['/eyComply'], { queryParams: { logout: true } });
      console.log('The dialog was closed', result);
    });
  }
}
