import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketBulkService {
  private socket$: WebSocketSubject<any>;
  pendingDownloads:string[] = [];     
  pendingDownloadsNew:string[] = [];   
  constructor(private settingsService: EycTaxSettingsService) { }

   public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.getNewWebSocket();
    }
  }
  
  private getNewWebSocket() {
    let WS_ENDPOINT = `${this.settingsService.taxReporting.websocket_bulk_url}`;
    const url_ws = WS_ENDPOINT.replace("https:", "wss:");
    console.log("url ws v2->", url_ws);
    this.socket$ = webSocket({url: url_ws,
      deserializer: ({data}) => data,
      openObserver: { next: () => {console.log('open conection websocket Bulk')}},
      closeObserver: { next: () => {console.log('closed conection websocket')}}
    });

    this.socket$.subscribe(msg => {
      console.log('message from server: ' + msg);
      //uncomment when the backend is ready, temporary.
      /*const objectFromWs = JSON.parse(msg);
      console.log('Object from ws ->', objectFromWs);
      const objectContent = JSON.parse(objectFromWs.content);
      console.log('Object content ->', objectContent);*/
      if(sessionStorage.getItem("pendingDownloadsBulk")){
          //uncomment when the backend is ready
          const url = msg;//objectContent.downloadUrl;
          window.open(url);
          const id = "12345-6789-9876";//objectContent.UIUUID;
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

  sendMessage(uiuuid:string) {
    //let userEmail = sessionStorage.getItem('userEmail');
    console.log("send to web socket->", uiuuid);
    this.socket$.next(uiuuid);
    if(sessionStorage.getItem("pendingDownloadsBulk")){
      this.pendingDownloads = JSON.parse(sessionStorage.getItem("pendingDownloadsBulk"));
      this.pendingDownloads.push(uiuuid);
      sessionStorage.setItem("pendingDownloadsBulk", JSON.stringify(this.pendingDownloads));
      console.log('add id to pendingDownloadsBulk', this.pendingDownloads);
     }else{
      this.pendingDownloads.push(uiuuid); 
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

}
