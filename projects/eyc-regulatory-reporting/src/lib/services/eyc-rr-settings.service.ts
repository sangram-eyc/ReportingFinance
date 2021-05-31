import { Injectable,Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EycRrSettingsService {

  constructor(@Inject('apiEndpoint') private apiEndpoint, @Inject('rrproduction') private rrproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  public production = this.rrproduction;

  get regReportingFiling(): any {
    const regulatory_Reporting = {
      filing_details: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/getFilingDetails?filter=active' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      filing_history: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/getFilingDetails?filter=completed&' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      filing_search: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/searchFilingDetails?filter=completed&' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      rr_filing_entities: this.rrproduction ? this.API_ENDPOINT + '' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
      client_review_filing_entities: this.rrproduction ? this.API_ENDPOINT + '' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
    }

    return regulatory_Reporting;
  }
  
}
