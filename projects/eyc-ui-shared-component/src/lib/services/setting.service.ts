import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(@Inject('apiEndpoint') private apiEndpoint, @Inject('rrproduction') private rrproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  // public API_ENDPOINT = "https://10.48.234.20/qa32/"
  // private rrproduction = true;
  public production = this.rrproduction;

  get regReportingFiling(): any {
    const regulatory_Reporting = {
      add_comment: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment',
      upload: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload',
    }
    return regulatory_Reporting;
  }
}
