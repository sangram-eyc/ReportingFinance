import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
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
  @Output() bulkprocesed: EventEmitter<string> = new EventEmitter<string>();
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
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton });
    // setTimeout(() => {
      console.log("funds for bulk->", this.modalDetails.funds);
      this.fundsList = [];
      this.modalDetails.funds.forEach(element => {
        this.fundsList.push({
          "fundId": element.id,
          "name" : element.name
        });
      }); 
      const data:any = { "fundDTOS" : this.fundsList }    
      this.bulkService.bulkDownloadFirstCall(data).subscribe(resp => {
        window.open(resp.data.fileUploadDTO[0].url);
        this.bulkprocesed.emit(resp);      
      }, error => {
        console.log('Error bulkDownloadFirstCall', error);
      });  
  // }, 20000); 
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }
}
