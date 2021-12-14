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
    //var sock = new WebSocket('wss://10.48.234.20/qa34/notifierAgentService/ws-notifier-agent-communication'); 
    var sock = new WebSocket('ws://eycomplyapp-qa34-service-notifieragentservice:8080/notifierAgentService/ws-notifier-agent-communication');
    sock.onopen = function() {
      console.log('open');
      sock.send('testByJonnathan');
    };
 
    sock.onmessage = function(e) {
        console.log('message', e.data);
        sock.close();
    };
 
    sock.onclose = function() {
        console.log('close');
    }
      /*console.log("funds for bulk->", this.modalDetails.funds);
      this.fundsList = [];
      this.modalDetails.funds.forEach(element => {
        this.fundsList.push({
          "fundId": element.id,
          "name" : element.name
        });
      }); 
      const data:any = { "fundDTOS" : this.fundsList }    
      this.bulkService.bulkDownloadFirstCall(data).subscribe(resp => {
        window.open(resp.data.fileUploadDTO.url);
        this.bulkprocesed.emit(resp);      
      }, error => {
        console.log('Error bulkDownloadFirstCall', error);
      }); */  
  }
  
  close(): void {
    this.dialogRef.close({ button: this.modalDetails.footer.NoButton });
  }
}
