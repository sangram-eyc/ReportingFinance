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
      production_cycles_details: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductionCyclesDetails.json',
      production_cycles_statusTracker: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/StatusTrackerLinks.json',
      production_cycles_downloadFile: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles/funds' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductCycleDownloadFile.json',
      production_cycles_approveEntities: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/taxreporting/production-cycles/funds/status' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/ProductCycleApproveEntiities.json',
      add_task: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      upload: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      tasks_list: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/CommentsList.json',
      add_comment: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      comments_list: this.production ? this.API_ENDPOINT + 'commentaryService/api/v2/commentary' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/replyCommentsList.json',
      update_task_status: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/updateStatusResponse.json',
      delete_tag: this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      delete_priority : this.production ? this.API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      list_users_to_add : this.production ? this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/usersToAddToFund.json' : this.API_ENDPOINT + 'assets/eyc-tax-reporting/mock/usersToAddToFund.json'
    }

    return tax_Reporting;
  }


}