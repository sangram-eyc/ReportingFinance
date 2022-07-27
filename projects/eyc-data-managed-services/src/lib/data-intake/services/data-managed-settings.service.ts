import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagedSettingsService {
  constructor(
    @Inject('dataManagedProduction') private dataManagedProduction,
    @Inject('dataManagedEndPoint') private dataManagedEndPoint,
    @Inject('pbiApiEndPoint') private pbiApiEndPoint) { }
  public API_ENDPOINT = this.dataManagedEndPoint.slice(-1) === "." ?
    this.dataManagedEndPoint.substr(0, this.dataManagedEndPoint.length - 1) :
    this.dataManagedEndPoint;
  public production = this.dataManagedProduction;
  
  get dataManagedServices(): any {
    console.log('API_ENDPOINT', this.API_ENDPOINT);
    console.log('pbiApiEndPoint-data-managed-setting', this.pbiApiEndPoint);
    const data_Managed_Services = {
      file_summary_list: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/data-summary' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      file_summary_list_daily: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list-daily.json',
      file_summary_list_monthly: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      file_data_provider: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-charts-data.json',
      file_data_provider_daily: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-providers-daily.json',
      file_data_provider_monthly: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-providers-monthly.json',
      file_data_domain_daily: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-domains-daily.json',
      file_data_domain_monthly: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-domains-monthly.json',
      file_general_ledger_daily: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/general-ledger-data.json',
      file_general_ledger: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/general-ledger-data.json',
      exception_reports_table: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/exception-reports-table-data.json',
      file_review_data: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/data-intake-chart-multi-data.json',
      file_review_table_data: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/totals-report' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/review-file-data.json',
      exception_table_data:this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/totals-report/exception' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/review-file-data.json',
      review_by_group_provider_domain:this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/review-by-group' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      PBI_AUTH_TOKEN_URL:this.production ? this.API_ENDPOINT +'dmsdataintakeservice/api/v2/dms/getPBIEmbedToken':this.API_ENDPOINT +'dmsdataintakeservice/api/v2/dms/getPBIEmbedToken',
      PBI_EMBED_URL:this.production ? this.API_ENDPOINT +'dmsdataintakeservice/api/v2/dms/getPBIEmbedUrl':this.API_ENDPOINT +'dmsdataintakeservice/api/v2/dms/getPBIEmbedUrl',
      base_Url:this.API_ENDPOINT,
      file_summary_review_all: this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/data-summary-review' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/file-summary-list.json',
      exception_details_table_data:this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/exception-details' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/review-file-data.json',
      api_catalog:this.production ? this.API_ENDPOINT + 'dmsdataintakeservice/api/v2/dms/api-catalog' : this.API_ENDPOINT + 'assets/eyc-data-managed-services/mock/api-catalog.json'

    }
    console.log('data_Managed_Services', data_Managed_Services);
    return data_Managed_Services;
  }

}
