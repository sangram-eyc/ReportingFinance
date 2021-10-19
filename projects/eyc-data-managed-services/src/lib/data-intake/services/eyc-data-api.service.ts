import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EycDataApiService {
  constructor(private httpClient: HttpClient) { }
  private setHeaders() {
    const headersConfig = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return headersConfig;
  }

  /*--------------GENERIC API FOR GET METHOD-------------*/
  invokeGetAPI(url: string): Observable<any> {
    const headers = this.setHeaders();
    return this.httpClient.get<any>(url, { headers });
  }
}
