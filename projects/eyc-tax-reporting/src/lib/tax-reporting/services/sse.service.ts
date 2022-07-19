import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";
import { EycTaxSettingsService } from "../../services/eyc-tax-settings.service";

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private _zone: NgZone, private settingsService: EycTaxSettingsService) {}
  private eventSource: EventSource;
  getServerSentEvent(username: string): Observable<MessageEvent> {
    return Observable.create(observer => {
      const eventSource = this.getEventSource(this.settingsService.taxReporting.sse_client_url + username);
      eventSource.onopen = (ev) => {
        this._zone.run(() => {
          observer.next(ev);
        });
      };
      eventSource.onerror = (error) => {
        setTimeout(() => {
          console.log('Reconnecting');
        }, 1000);
      };
      eventSource.addEventListener('message', event => {
        this._zone.run(() => {
          observer.next(event);
        });
      });
    });
  }
  private getEventSource(url: string): EventSource {
    if (this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSource(url);
    return this.eventSource;
  }
}
