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
      filing_history: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/getFilingDetails?filter=completed' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      filing_search: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/searchFilingDetails?filter=completed&' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filings.json',
      rr_filing_entities: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/entity?stage=Reporting' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
      approve_rr_filing_entities: this.rrproduction ? this.API_ENDPOINT +'/api/v2/regreporting/entity': this.API_ENDPOINT +  '',
      client_review_filing_entities: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/entity?stage=Client review' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/filingEntities.json',
      approve_client_review_filing_entities: this.rrproduction ? this.API_ENDPOINT +'/api/v2/regreporting/entity': this.API_ENDPOINT +  '',
      submission_xml_files: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/xmlFilesList.json' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/xmlFilesList.json',
      submission_download_xml: this.rrproduction ? this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/',
      fund_scoping_details: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/fundScopingDetails?' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/fundScopingDetails.json',
      fund_scoping_status: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/fundScopingStatus?' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/fundScopingStatus.json',
      approve_fund_scoping_status: this.rrproduction ? this.API_ENDPOINT +'/api/v2/regreporting/fundScopingStatus': this.API_ENDPOINT +  '',
    }

    return regulatory_Reporting;
  }

  get pbiReportingConfig(): any {
    const regulatory_Reporting = {
      question_details: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/getQuestionsByFilingId/' : this.API_ENDPOINT +  'assets/eyc-regulatory-reporting/mock/pbi_report.json',
      pbi_auth_token: '/api/v1/powerBI/authToken',
      filing_names: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/filing/names' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/filingNames.json',
      period: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/filings/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_period.json',
      PBIReportId: this.rrproduction ? this.API_ENDPOINT + '/api/v2/regreporting/getPBIReportIDByFilingIdQuestionId/' : this.API_ENDPOINT + 'assets/eyc-regulatory-reporting/mock/pbi_report.json',
    }

    return regulatory_Reporting;
  }
  
}