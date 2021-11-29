import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-bulk-download-modal',
  templateUrl: './bulk-download-modal.component.html',
  styleUrls: ['./bulk-download-modal.component.scss']
})
export class BulkDownloadModalComponent implements OnInit {
  modalDetails;
  constructor(public dialogRef: MatDialogRef<BulkDownloadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.modalDetails = data;
     }

  ngOnInit(): void {
  }

  onClickYes(){
    console.log("click to download .zip file");
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton }); 
  }
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

}
