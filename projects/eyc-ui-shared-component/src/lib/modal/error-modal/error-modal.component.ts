import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent implements OnInit {
  modalDetails;
  constructor(
    public dialogRef: MatDialogRef<ErrorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.modalDetails = data;
    console.log(this.modalDetails);
    
  }

  ngOnInit(): void {
  }

  
  onClickYes() {
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
  }
}
