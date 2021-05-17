import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {EycRrSettingsService} from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class RegulatoryReportingFilingService {

  constructor(
    private http: HttpClient,private settingsService: EycRrSettingsService
  ) { }


  getFilings() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.settingsService.API_ENDPOINT+ 'assets/mock/filings.json', {
      headers
    });
  }

  getReportingFilingEntities() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.settingsService.API_ENDPOINT+'assets/mock/filingEntities.json', {
      headers
    });
  }

}
