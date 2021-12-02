import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BulkDownloadService} from '../services/bulk-download.service'

@Component({
  selector: 'lib-bulk-download-modal',
  templateUrl: './bulk-download-modal.component.html',
  styleUrls: ['./bulk-download-modal.component.scss']
})
export class BulkDownloadModalComponent implements OnInit {
  modalDetails;
  fundsList:any[] = [];
  constructor(
    private bulkService: BulkDownloadService,
    public dialogRef: MatDialogRef<BulkDownloadModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.modalDetails = data;
     }

  ngOnInit(): void {
  }

  onClickYes(){
    console.log("funds for bulk->", this.modalDetails.funds);
    this.fundsList = [];
    this.modalDetails.funds.forEach(element => {
      this.fundsList.push({
        "fundId": element.id,
        "name" : element.name
      });
    }); 
    const data:any = { "fundDTOS" : this.fundsList }    
    this.bulkService.bulkDownloadFirstCall(data).subscribe( resp => {
      console.log("resp bulk", resp);
      this.dialogRef.close({ button: this.modalDetails.footer.YesButton }); 
    }, error => {
      console.log('Error bulkDownloadFirstCall', error);
    });   
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

}
