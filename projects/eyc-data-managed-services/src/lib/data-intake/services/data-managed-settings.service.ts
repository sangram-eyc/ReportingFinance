import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagedSettingsService {
  constructor(
    @Inject('dataManagedProduction') private dataManagedProduction,
    @Inject('dataManagedEndPoint') private dataManagedEndPoint) { }
  public API_ENDPOINT = this.dataManagedEndPoint.slice(-1) === "." ?
    this.dataManagedEndPoint.substr(0, this.dataManagedEndPoint.length - 1) :
    this.dataManagedEndPoint;
  public production = this.dataManagedProduction;

  get dataManagedServices(): any {
    const data_Managed_Services = {
      file_summary_list: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      file_summary_list_daily: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list-daily.json',
      file_summary_list_monthly: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      file_data_provider: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-charts-data.json',
      file_data_provider_daily: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-charts-daily-data.json',
      file_data_provider_monthly: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-charts-data.json',
      file_review_data: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-chart-multi-data.json',
      file_review_table_data: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/review-file-data.json'

    }
    return data_Managed_Services;
  }

}
