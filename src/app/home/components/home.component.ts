import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { IS_SURE_FOOT, SESSION_ID_TOKEN, HIDE_HOME_PAGE } from '../../services/settings-helpers';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { ModuleLevelPermissionService } from '@default/services/module-level-permission.service';
import { Router } from '@angular/router';
import { ConcurrentSessionsService } from '@default/services/concurrent-sessions/concurrent-sessions.service';


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
    private router: Router,
    private concurrentSessionsService:ConcurrentSessionsService
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
      this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
    }

    this.moduleLevelPermission.getModuleLevelPermission().subscribe(async res => {
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
        this.settingsService.setModulePermissionData = res['data'];
        sessionStorage.setItem('modules', JSON.stringify(res['data']));
        await this.setSessionId(res['data'].userEmail);
        this.moduleLevelPermission.invokeModulePermissionDetails(res['data']);
        if (res['data'].userModules.hasOwnProperty('Regulatory Reporting')) {
          this.permissionList('Regulatory Reporting');
        } else if (res['data'].userModules.hasOwnProperty('Tax Reporting')) {
          this.permissionList('Tax Reporting');
        } else if (res['data'].userModules.hasOwnProperty('Data Managed Services')) {
          this.permissionList('Data Managed Services');  // DMS Permission
        }else if (res['data'].userModules.hasOwnProperty('European Fund Reporting')) {
          this.permissionList('European Fund Reporting'); 
        } else {
          this.navigation();
        }
      }
    });
  }

  permissionList(_module) {
    this.moduleLevelPermission.getPermissionsListByModule(_module).subscribe(resp => {
      this.navigation();
      sessionStorage.setItem("permissionList", JSON.stringify(resp.data));
    });
  }

 
 async setSessionId(email: any) {
    console.log('setSessionId email->', email)
    //set session id to avoid concurrent sessions
    const body = {
      "userEmail": email
    }

    try {
      const res = await this.concurrentSessionsService.addSessionId(body);
      sessionStorage.setItem('session_id', res['data'].id);
    } catch (err) {
      // request failed
      console.error(err);
    }
  }


  navigation() {
    if (IS_SURE_FOOT) {
      this.router.navigate(['/app-tax-reporting'])
    }
    else {
      if (this.moduleLevelPermissionData.userModules.hasOwnProperty('All')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-regulatory-filing']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Regulatory Reporting')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-regulatory-filing']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Tax Reporting')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/app-tax-reporting']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Data Intake')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/data-intake-landing']);

      } else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('Data Managed Services')) {  // DMS Navigation
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/data-managed-services']);

      }else if (this.moduleLevelPermissionData.userModules.hasOwnProperty('European Fund Reporting')) {
        HIDE_HOME_PAGE ? this.router.navigate(['/home']) : this.router.navigate(['/european-fund-reporting']);

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
      console.log('The dialog was closed', result);
    });
  }
}
