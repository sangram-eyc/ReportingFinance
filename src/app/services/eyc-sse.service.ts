import { Injectable } from '@angular/core';
import { SSE } from 'sse.js';
import { v4 as uuid } from 'uuid';
import { SESSION_ACCESS_TOKEN } from '../services/settings-helpers';

@Injectable({
  providedIn: 'root'
})
export class EycSseService {
  eventSource: SSE;

  constructor() { }

    public getEventSourceWithGet(url: string): SSE {
      return this.buildEventSource(url, 'GET');
    }

    private buildEventSource(url: string, meth: string): SSE {
      this.closeEventSource();
      const options = this.buildOptions(meth);
      this.eventSource = new SSE(url, options);      
      return  this.eventSource;
    }

    public closeEventSource() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }

    protected checkAuthorization(): string {
      const currentUserToken = sessionStorage.getItem(SESSION_ACCESS_TOKEN);
      const auth = 'Bearer ' + currentUserToken;
      return auth;
    }

    private buildOptions(meth: string,): {
      method: string;
      headers: string | { Authorization: string , 'X-Correlation-ID': string };
    } {
      const auth = this.checkAuthorization();
      return {
        method: meth,
        headers: { Authorization: auth , 'X-Correlation-ID': uuid() },    
      };
    }
}
