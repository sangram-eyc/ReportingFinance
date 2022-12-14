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
      'Content-Type': 'application/json'
    });
    return headersConfig;
  }

  private setHeaders1() {
    const headersConfig = new HttpHeaders({
      Accept: 'application/json, text/plain, */*'
    });
    return headersConfig;
  }

  /*--------------GENERIC API FOR GET METHOD-------------*/
  invokeGetAPI(url: string): Observable<any> {
    const headers = this.setHeaders();
    return this.httpClient.get<any>(url, { headers });
  }

  /*--------------GENERIC API FOR POST METHOD-------------*/
  invokePostAPI(url: string, params?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.post(url, params, { headers });
  }

  /*--------------GENERIC API FOR POST BODY METHOD-------------*/
  invokePostBodyAPI(url: string, bodyParam?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.post(url, bodyParam, { headers });
  }
}
