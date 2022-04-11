import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EuropeanFundReportingSettingsService {

  constructor(@Inject('europeanFRapiEndpoint') private apiEndpoint, @Inject('europeanFRProduction') private efrproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ? this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  public production = this.efrproduction;

  get efrReporting(): any {
    const efr_Reporting = {
      example_report: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/managementReports' : this.API_ENDPOINT + 'eyc-tax-reportig/assets/eyc-tax-reporting/mock/management_report.json'
    }
    return efr_Reporting;
  }
}
