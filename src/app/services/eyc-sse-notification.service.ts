import { Observable } from 'rxjs';
import { Injectable, NgZone } from '@angular/core';
import { EycSseService } from './eyc-sse.service';
import { EycTaxSettingsService } from "../../../projects/eyc-tax-reporting/src/lib/services/eyc-tax-settings.service";

@Injectable({
  providedIn: 'root'
})
export class EycSseNotificationService {

  constructor(private zone: NgZone, private sseService: EycSseService, private settingsService: EycTaxSettingsService) { }
   
    public connect(username: string): Observable<MessageEvent> { 
        let origin = window.location.origin + window.location.pathname;
        let base_url_sse = this.settingsService.taxReporting.sse_client_url;
        let sse_ENDPOINT = this.settingsService.production ? 
                        origin.trim() + base_url_sse.trim(): 
                        this.settingsService.taxReporting.sse_client_url;
        const conecctionUrl = sse_ENDPOINT+username;                 
        return this.getServerSentEvent(conecctionUrl);
    }

    private getServerSentEvent(url: string): Observable<MessageEvent> {
      return new Observable((observer) => {
        const eventSource = this.sseService.getEventSourceWithGet(url);
        eventSource.stream();
        eventSource.onmessage = (event) => {
          this.zone.run(() => {
            observer.next(event);
          });
        };
        eventSource.onerror = (error) => {
          this.zone.run(() => {
            observer.error(error);
          });
        };
        eventSource.onreadystatechange = (event) => {
          if(event.readyState === 2){
            console.log('sse connection closed');
          }      
        };
      });
    }
}
