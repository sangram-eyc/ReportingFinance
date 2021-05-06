import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {

  constructor(
    private http: HttpClient
  ) { }


  getFilings() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get('http://localhost:4200/assets/mock/filings.json', {
      headers
    });
  }

}
