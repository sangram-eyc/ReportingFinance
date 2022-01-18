import { Injectable } from '@angular/core';
import {environment} from '@env/environment';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import {notifier_ws} from '../helper/api-config-helper';

@Injectable({
  providedIn: 'root'
})
export class EycWebSocketService {
  private socket$: WebSocketSubject<any>;

  constructor() { }

   public connect(){
    if (!this.socket$ || this.socket$.closed) {
     this.socket$  = this.getNewWebSocket();
    }
    return this.socket$;
  }
  
   private getNewWebSocket(){
    //let origin = window.location.origin + window.location.pathname;
    const base_url_ws = notifier_ws;
    const WS_ENDPOINT = environment.production ?
                      environment.production + base_url_ws.trim(): base_url_ws;
    const url_ws = WS_ENDPOINT.replace("https:", "ws:");
    console.log("url ws->", url_ws);
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
