import { Injectable, NgZone } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor(private _zone: NgZone) {}
  private eventSource: EventSource;
  getServerSentEvent(url: string): Observable<MessageEvent> {
    return Observable.create(observer => {
      const eventSource = this.getEventSource(url);
      eventSource.onopen = (ev) => {
        this._zone.run(() => {
          observer.next(ev);
        });
      };
      eventSource.onerror = (error) => {
        setTimeout(() => {
          console.log('Reconnecting');
          this.getServerSentEvent(url);
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
