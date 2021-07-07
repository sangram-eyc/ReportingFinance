import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-visualisation-modal',
  templateUrl: './visualisation-modal.component.html',
  styleUrls: ['./visualisation-modal.component.scss']
})
export class VisualisationModalComponent implements OnInit {
  modalDetails;
  constructor(
    public dialogRef: MatDialogRef<VisualisationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.modalDetails = data;
    console.log(this.modalDetails);
    
  }

  ngOnInit(): void {
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  onClickYes() {
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
  }
}
