import { Component, Inject, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CountdownEvent} from 'ngx-countdown';

@Component({
  selector: 'lib-session-extend-modal',
  templateUrl: './session-extend-modal.component.html',
  styleUrls: ['./session-extend-modal.component.scss']
})
export class SessionExtendModalComponent implements OnInit, OnDestroy {
  modalDetails;
  isSessionExtent = true;
  constructor(
    public dialogRef: MatDialogRef<SessionExtendModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalDetails = data;
    console.log(this.modalDetails);

  }

  onTimerFinished(e: CountdownEvent) {
    if (e.action == 'done') {
      this.isSessionExtent = false;
    }
  }

  ngOnInit(): void {
  }




  close(): void {
    this.logout();
  }
  sessionExtent() {
    this.dialogRef.close({ button: "Extend session" });
  }

  logout() {
    this.dialogRef.close({ button: "Log out" });
  }

  logIn() {
    this.dialogRef.close({ button: "Log in" });
  }
  ngOnDestroy() {
   
  }
}
