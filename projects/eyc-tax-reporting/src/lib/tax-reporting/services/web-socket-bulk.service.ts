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
    const WS_ENDPOINT = this.settingsService.taxReporting.websocket_bulk_url;
    this.socket$ = webSocket({url: WS_ENDPOINT,
      deserializer: ({data}) => data,
      openObserver: { next: () => {console.log('open conection websocket')}},
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
          const url = "https://eyus.sharepoint.com/sites/SurefootTesting/_layouts/15/download.aspx?UniqueId=52833d2f-bdce-4df4-a4ed-46d2f96888bb&Translate=false&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvZXl1cy5zaGFyZXBvaW50LmNvbUA1Yjk3M2Y5OS03N2RmLTRiZWItYjI3ZC1hYTBjNzBiODQ4MmMiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjQwMDE3NTg1IiwiZXhwIjoiMTY0MDAyMTE4NSIsImVuZHBvaW50dXJsIjoiMjFVcVJrUkZSczF2U0ZvN002MGcvY2poSjVFUC9sNW9jeWRxbjdBUVV3OD0iLCJlbmRwb2ludHVybExlbmd0aCI6IjEzNyIsImlzbG9vcGJhY2siOiJUcnVlIiwiY2lkIjoiTm1Vd05qSTNPREl0Wm1Wa09TMDBOMlJpTFRnek56Z3ROVE14T0RCa05EZGlPVEl4IiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6IlptRTNPVEl6WkdNdE1tRTNOUzAwWW1WbExUa3daall0TURBd1lqRm1aRE5sT1RrNCIsImFwcF9kaXNwbGF5bmFtZSI6IkVZLUdCTC1DVFAtUi1XLU8tQ1RQLUVZQy1RQTM0LVYxLVBSRCIsImdpdmVuX25hbWUiOiJKb25uYXRoYW4iLCJmYW1pbHlfbmFtZSI6IkNhYmFsbGVybyIsInNpZ25pbl9zdGF0ZSI6IltcImttc2lcIixcImR2Y19kbWpkXCJdIiwiYXBwaWQiOiI1YTU2YTU0Ny04NjBlLTQ2YjAtOWIxYi05ZDY4OWY2ZjQ0MWMiLCJ0aWQiOiI1Yjk3M2Y5OS03N2RmLTRiZWItYjI3ZC1hYTBjNzBiODQ4MmMiLCJ1cG4iOiJqb25uYXRoYW4uY2FiYWxsZXJvQGV5LmNvbSIsInB1aWQiOiIxMDAzMjAwMTVGNzhGMDI0IiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MTAwMzIwMDE1Zjc4ZjAyNEBsaXZlLmNvbSIsInNjcCI6ImFsbHNpdGVzLm1hbmFnZSBhbGxzaXRlcy5yZWFkIGFsbHNpdGVzLndyaXRlIGFsbHByb2ZpbGVzLnJlYWQiLCJ0dCI6IjIiLCJ1c2VQZXJzaXN0ZW50Q29va2llIjpudWxsLCJpcGFkZHIiOiI0MC4xMjYuMjMuMzYifQ.bzhrZ2hYbmdtWDYyODBpRWl5Rzc1dVdsWHRMT3I5aDU1TmtFNGdaZFMzZz0&ApiVersion=2.0";//objectContent.downloadUrl;
          window.open(url);
          const id = "c4c48fc2-29d6-452d-a752-618af4e6647c";//objectContent.UIUUID;
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
    let userEmail = sessionStorage.getItem('userEmail');
    this.socket$.next(userEmail);
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
