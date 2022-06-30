import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class WebSocketBulkService {
  private socket$: WebSocketSubject<any>;

  constructor(private settingsService: EycTaxSettingsService, private dialog: MatDialog,) { }

   public connect(){
    if (!this.socket$ || this.socket$.closed) {
     this.socket$  = this.getNewWebSocket();
    }
    return this.socket$;
  }
  
   private getNewWebSocket(){
    let origin = window.location.origin + window.location.pathname;
    let base_url_ws = this.settingsService.taxReporting.websocket_bulk_url;
    let WS_ENDPOINT = this.settingsService.production ? 
                      origin.trim() + base_url_ws.trim(): 
                      this.settingsService.taxReporting.websocket_bulk_url;
    const url_ws = WS_ENDPOINT.replace("https:", "ws:");
    //const url_ws = this.settingsService.taxReporting.websocket_bulk_url.replace("https:", "wss:");
    console.log("url ws new->", url_ws);
    return webSocket({url: url_ws,
        deserializer: ({data}) => data,
        openObserver: { 
          next: () => {
            console.log('open conection websocket Bulk download');             
          }},
        closeObserver: { 
          next: () => {
            console.log('closed conection websocket');
          }
        }
      });
  }

  public openConection(userEmail:string){
    this.socket$.next(userEmail);
  }

  public closeConection(){
    this.socket$.complete();
  }

}
