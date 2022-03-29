import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiSharedService {

  constructor(private httpClient: HttpClient) { }

  private setHeaders() {
    const headersConfig = new HttpHeaders({
        'Content-Type': 'application/json',

    });
    return headersConfig;
  }

  private setHeaders1() {
    const headersConfig = new HttpHeaders({
       Accept: 'application/json, text/plain, */*',

    });
    return headersConfig;
  }

    /*--------------GENERIC API FOR GET METHOD-------------*/
    invokeGetAPI(url: string): Observable<any> {
      const headers = this.setHeaders();
      return this.httpClient.get<any>(url, { headers });
    }

    /*--------------GENERIC API FOR GET METHOD-------------*/
    invokeGetDownloadAPI(url: string) {
      const headers = this.setHeaders();
      return this.httpClient.get<any>(url, { headers , responseType: 'blob' as 'json' , observe: 'response' });
    }

    /*--------------GENERIC API FOR POST METHOD-------------*/
  invokePostAPI(url: string, params?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.post(url, params, { headers });
  }

  /*--------------GENERIC API FOR DELETE METHOD-------------*/
  invokeDeleteAPI(url: string): Observable<any> {
    const headers = this.setHeaders();
    return this.httpClient.delete<Response>(url, { headers });
  }

  /*--------------GENERIC API FOR PUT METHOD-------------*/
  invokePutAPI(url: string, params?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.put(url, params, { headers });
  }

  /*--------------GENERIC API FOR GET METHOD (No Header)-------------*/
  invokeGetAPINoHeader(url: string): Observable<any> {
    return this.httpClient.get<any>(url);
  }

  /*--------------GENERIC API FOR POST METHOD-------------*/
  invokePostAPINoHeader(url: string, params?: any) {
    // Accept
  //   const headersConfig = new HttpHeaders({
  //     Accept: 'application/json, text/plain, */*',
  //     Content-Type: 0
  //  });
  const headers = new HttpHeaders();
  headers.set('Content-Type', 'application/json; text/plain; */*');
    return this.httpClient.post(url, params, { headers } );
  }
}