import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EycRrApiService {

  constructor(private httpClient: HttpClient,) { }
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

    /*--------------GENERIC API FOR POST DOWNLOAD METHOD-------------*/
    invokePostDownloadAPI(url: string, body: any) {
      const headers = this.setHeaders();
      // return this.httpClient.post<any>(url, { headers , responseType: 'blob' as 'json' , observe: 'response' }, body);

      return this.httpClient.post(url, body, { headers });
    }

    /*--------------GENERIC API FOR POST METHOD-------------*/
  invokePostAPI(url: string, params?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.post(url, params, { headers });
  }

  /*--------------GENERIC API FOR DELETE METHOD-------------*/
  invokeDeleteAPI(url: string): Observable<Response> {
    const headers = this.setHeaders();
    return this.httpClient.delete<Response>(url, { headers });
  }
  // /*--------------GENERIC API FOR DELETE METHOD with a request body -------------*/
  invokeDeleteAPIBody(url: string, body: any): Observable<Response> {
  const options = {
      headers: this.setHeaders(),
      body: body,
    };
    return this.httpClient.delete<Response>(url, options);
  }


  /*--------------GENERIC API FOR PUT METHOD-------------*/
  invokePutAPI(url: string, params?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.put(url, params, { headers });
  }

  /*--------------GENERIC API FOR POST BODY METHOD-------------*/
  invokePostBodyAPI(url: string, bodyParam?: any) {
    const headers = this.setHeaders1();
    return this.httpClient.post(url, bodyParam, { headers });
  }
}
