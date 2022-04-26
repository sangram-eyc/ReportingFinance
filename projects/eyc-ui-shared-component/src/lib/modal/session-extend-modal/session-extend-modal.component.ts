import { Component, Inject, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'lib-session-extend-modal',
  templateUrl: './session-extend-modal.component.html',
  styleUrls: ['./session-extend-modal.component.scss']
})
export class SessionExtendModalComponent implements OnInit, OnDestroy {
  modalDetails;
  countDown: Subscription;
  counter = 120;
  tick = 1000;
  isSessionExtent = true;
  constructor(
    public dialogRef: MatDialogRef<SessionExtendModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.modalDetails = data;
    console.log(this.modalDetails);

  }

  ngOnInit(): void {
    this.countDown = timer(0, this.tick).subscribe(() => {
      if (this.counter == 0) {
        this.isSessionExtent = false;
        return;
      } else {
        --this.counter
      }
    });
  }




  close(): void {
    if (this.isSessionExtent) {
      this.logout();
    } else {
      this.logIn();
    }
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
    this.countDown = null;
  }
}
