import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-information-bar-chart-modal',
  templateUrl: './information-bar-chart-modal.component.html',
  styleUrls: ['./information-bar-chart-modal.component.scss']
})
export class InformationBarChartModalComponent implements OnInit {
  modalDetails;
  colors= ['#9C82D4', '#87D3F2', '#8CE8AD'];
  labelsChart = ['EY tax preparation', 'In client review', 'Approved by client'];
  emptyState = "Empty indicates no data received";
  emptyMsg = "NO DATA RECEIVED"

  constructor(public dialogRef: MatDialogRef<InformationBarChartModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.modalDetails = data;
     }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

}
