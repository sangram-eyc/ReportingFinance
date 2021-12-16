import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketBulkService {
  ws:WebSocket;
  socketIsOpen = 1;
  response:any;
  constructor() { }

 createObservableSocket(url:string){
  this.ws = new WebSocket(url);

  this.ws.onopen = (event) => {
    console.log('open conection websocket');
  }

  this.ws.onmessage = (event) =>{
    console.log('websocket response ', event.data);
  }

  this.ws.onclose = (event) =>{
    console.log('close websocket ', event);
  }

 }

sendMessage(message:string){
   if(this.ws.readyState === this.socketIsOpen){
     this.ws.send(message);
     console.log('send message to websocket ' + message); 
   }else{
    console.log('Message was not send to the server and websocket is closed.'); 
   }
}

webSocketClose(){
  this.ws.close();
}

}
