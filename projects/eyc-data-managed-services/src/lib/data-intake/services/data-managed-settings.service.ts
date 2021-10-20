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
    }
    return data_Managed_Services;
  }

}
