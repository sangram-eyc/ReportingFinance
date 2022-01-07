import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BulkDownloadService} from '../services/bulk-download.service'
import {WebSocketBulkService} from '../services/web-socket-bulk.service'

@Component({
  selector: 'lib-bulk-download-modal',
  templateUrl: './bulk-download-modal.component.html',
  styleUrls: ['./bulk-download-modal.component.scss']
})
export class BulkDownloadModalComponent implements OnInit {
  modalDetails;
  fundsList:any[] = [];
  pendingDownloads:string[] = [];     
  pendingDownloadsNew:string[] = [];  
  
  @Output() bulkprocesed: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private bulkService: BulkDownloadService,
    private wsService: WebSocketBulkService,
    public dialogRef: MatDialogRef<BulkDownloadModalComponent>,   
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.modalDetails = data;
     }

  ngOnInit(): void {
     
  }

  onClickYes(){
    this.dialogRef.close({ button: this.modalDetails.footer.YesButton }); 
      this.fundsList = [];
      this.modalDetails.funds.forEach(element => {
        this.fundsList.push({
          "fundId": element.id,
          "name" : element.name
        });
      }); 
      const userEmail = sessionStorage.getItem('userEmail');
      const data:any = {
        "idempotencyKey":  userEmail,
        "fundDTOS" : this.fundsList
       }    
      this.bulkService.bulkDownloadFirstCall(data).subscribe(resp => {
        const idFile = resp.data.fileUploadDTO.downloadId;
        this.storePendingDownload(idFile);
        this.bulkprocesed.emit(resp);     
      }, error => {
        console.log('Error bulkDownloadFirstCall', error);
      });   
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  storePendingDownload(downloadId:string){
    if(sessionStorage.getItem("pendingDownloadsBulk") != null){
        this.pendingDownloads = JSON.parse(sessionStorage.getItem("pendingDownloadsBulk"));
        this.pendingDownloads.push(downloadId);
        sessionStorage.setItem("pendingDownloadsBulk", JSON.stringify(this.pendingDownloads));
        console.log('add id to pendingDownloadsBulk', this.pendingDownloads);
    }else{
        this.pendingDownloads.push(downloadId);
        sessionStorage.setItem("pendingDownloadsBulk", JSON.stringify(this.pendingDownloads));
        console.log('create and add id to pendingDownloadsBulk', this.pendingDownloads);
    }
  }

}
