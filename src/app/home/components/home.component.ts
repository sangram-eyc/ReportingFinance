import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SESSION_ID_TOKEN } from '../../services/settings-helpers';
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
      if (!res['data']['userDetails']) {
        this.openErrorModal("Access Denied", "User is not a valid user. Please contact admin.");
      } else if (!res['data']['userDetails'].isActive) {
        this.openErrorModal("Access Denied", "User is not a active user. Please contact admin.");
      } else if (!res['data']['modules'].length) {
        this.openErrorModal("Access Denied", "User does not have access to any module. Please contact admin.");
      }
      sessionStorage.setItem("moduleLevelPermission", JSON.stringify(res['data']));
      this.moduleLevelPermission.invokeModulePermissionDetails();
    });
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
    if (!this.moduleLevelPermissionData['userDetails']) {
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
