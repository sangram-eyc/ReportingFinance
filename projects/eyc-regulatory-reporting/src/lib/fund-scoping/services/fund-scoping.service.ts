import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class FundScopingService {

  constructor(
    private http: HttpClient ,private settingsService: EycRrSettingsService
  ) { }

  getFilingFunds() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.settingsService.API_ENDPOINT+'assets/eyc-regulatory-reporting/mock/filingFunds.json', {
      headers
    });
  }

}
