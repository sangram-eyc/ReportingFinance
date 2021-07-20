import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {SESSION_ID_TOKEN} from '../../services/settings-helpers';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from 'projects/eyc-ui-shared-component/src/lib/modal/component/modal.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private settingsService: SettingsService, public dialog: MatDialog) { }

  ngOnInit(): void {
    if (sessionStorage.getItem(SESSION_ID_TOKEN)) {
      this.settingsService.setIdToken(sessionStorage.getItem(SESSION_ID_TOKEN));
    }
  }

  // openDialog() {
  //   const dialogRef = this.dialog.open(ModalComponent, {
  //     width: '400px',
  //     data: {
  //       type: "Confirmation",
  //       header: "Approve Selected",
  //       description: "Are you sure you want to approve the selected entities?",
  //       footer: {
  //         style: "start",
  //         YesButton: "Yes",
  //         NoButton: "No"
  //       }
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //   });
  // }
}
