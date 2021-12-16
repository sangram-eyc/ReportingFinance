import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BulkDownloadService} from '../services/bulk-download.service'
import {WebSocketBulkService} from '../services/web-socket-bulk.service'

@Component({
  selector: 'lib-bulk-download-modal',
  templateUrl: './bulk-download-modal.component.html',
  styleUrls: ['./bulk-download-modal.component.scss']
})
export class BulkDownloadModalComponent implements OnInit, OnDestroy {
  modalDetails;
  fundsList:any[] = [];
  url = 'wss://10.48.234.20/qa34/notifierAgentService/ws-notifier-agent-communication';

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
      this.wsService.createObservableSocket(this.url);
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
      const data:any = { "fundDTOS" : this.fundsList }    
      this.bulkService.bulkDownloadFirstCall(data).subscribe(resp => {
        //window.open(resp.data.fileUploadDTO.url);
        const idFile = resp.data.fileUploadDTO.uiuuid;
        this.sendMessageToServer(idFile);
        this.bulkprocesed.emit(resp);     
      }, error => {
        console.log('Error bulkDownloadFirstCall', error);
      });   
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }

  sendMessageToServer(msg:string){
  this.wsService.sendMessage(msg);
  }

  closeWebSocket(){
    this.wsService.webSocketClose();  
  }

  ngOnDestroy(): void {
      //this.closeWebSocket();
  }
}
