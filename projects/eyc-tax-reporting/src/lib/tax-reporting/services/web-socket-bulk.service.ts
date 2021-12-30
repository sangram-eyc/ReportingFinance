import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from 'eyc-ui-shared-component';

@Injectable({
  providedIn: 'root'
})
export class WebSocketBulkService {
  private socket$: WebSocketSubject<any>;
  pendingDownloads:string[] = [];     
  pendingDownloadsNew:string[] = [];   
  constructor(private settingsService: EycTaxSettingsService, private dialog: MatDialog,) { }

   public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.getNewWebSocket();
    }
  }
  
  private getNewWebSocket() {
    let origin = window.location.origin + window.location.pathname;
    let base_url_ws = this.settingsService.taxReporting.websocket_bulk_url;
    let WS_ENDPOINT = this.settingsService.production ? 
                      origin.trim() + base_url_ws.trim(): 
                      this.settingsService.taxReporting.websocket_bulk_url;
    const url_ws = WS_ENDPOINT.replace("https:", "wss:");
    console.log("url ws->", url_ws);
    this.socket$ = webSocket({url: url_ws,
        deserializer: ({data}) => data,
        openObserver: { next: () => {console.log('open conection websocket Bulk download')}},
        closeObserver: { next: () => {console.log('closed conection websocket')}}
    });

    this.socket$.subscribe(msg => {
      console.log('message from server: ' + msg);
      const objectFromWs = msg;//JSON.parse(msg);
      console.log('objectFromWs->', objectFromWs);
      if(sessionStorage.getItem("pendingDownloadsBulk")){
          const url = objectFromWs.value;
          if(url != ""){
             window.open(url);
          }
          if(objectFromWs.fails > 0){
             const fundsNames = objectFromWs.failsName.join(',');
             this.openErrorModal("Error", 
             "Some of selected files had errors, so that can't be downloaded. Please reload the page and try again the missing file(s) from : " + fundsNames + ".");
          }
          const id = objectFromWs.key;
          this.pendingDownloads = JSON.parse(sessionStorage.getItem("pendingDownloadsBulk"));
          this.pendingDownloadsNew = this.pendingDownloads.filter(item => item != id);
          sessionStorage.setItem("pendingDownloadsBulk", JSON.stringify(this.pendingDownloadsNew));
          console.log('deleted pending download'); 
        }else{
          console.log('sessionStorage does not exist');
        }
     }, 
      err => {
        console.log(err)
      }, 
      () => console.log('complete')
    );
  }

  sendMessage(downloadId:string) {
    console.log("send to web socket->", downloadId);
    this.socket$.next(downloadId);
    if(sessionStorage.getItem("pendingDownloadsBulk")){
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

  close() {
    this.socket$.complete();
   }
  
   unSubscribe(){
    this.socket$.unsubscribe();
   }

   openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
  }

}
