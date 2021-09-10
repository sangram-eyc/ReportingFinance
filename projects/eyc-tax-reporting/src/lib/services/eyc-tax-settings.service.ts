import { Injectable, Inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class EycTaxSettingsService {

  constructor(@Inject('taxapiEndpoint') private apiEndpoint, @Inject('taxProduction') private taxproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  public production = this.taxproduction;

  get taxReporting(): any {
    const tax_Reporting = {
      management_report: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/managementReports' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/management_report.json',
      production_cycles: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductionCyclesList.json',
      production_cycles_details: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/productionCycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductionCyclesDetails.json',
      production_cycles_statusTracker: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/StatusTrackerLinks.json',
      production_cycles_downloadFile: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles/funds' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductCycleDownloadFile.json',
    }

    return tax_Reporting;
  }


}