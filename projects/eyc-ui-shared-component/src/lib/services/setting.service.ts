import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(@Inject('apiEndpoint') private apiEndpoint, @Inject('rrproduction') private rrproduction,
  @Inject('taxapiEndpoint') private taxApiEndpoint, @Inject('taxProduction') private taxproduction) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  // public API_ENDPOINT = "https://10.48.234.20/qa32/"
  // private rrproduction = true;
  public production = this.rrproduction;

  get regReportingFiling(): any {
    const regulatory_Reporting = {
      add_comment: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment',
      list_comments: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/',
      upload: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload',
      download: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download',
    }
    return regulatory_Reporting;
  }

  public TAX_API_ENDPOINT = this.taxApiEndpoint.slice(-1) === "." ?
    this.taxApiEndpoint.substr(0, this.taxApiEndpoint.length - 1) : this.taxApiEndpoint;
  public tax_Production = this.taxproduction;
  get taxReportingComments():any{
      const tax_reporting = {
        /* uncomment when endpoint is ready */
/*         tasks_list: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/CommentsList.json',
        update_task_status: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/updateStatusResponse.json',
        delete_tag: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
        delete_priority: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json', 
        download: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/attachmentsByComments.json',*/
        tasks_list: this.tax_Production ? this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/CommentsList.json' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/CommentsList.json',
        update_task_status: this.tax_Production ? this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/updateStatusResponse.json' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/updateStatusResponse.json',
        delete_tag: this.tax_Production ? this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
        delete_priority: this.tax_Production ? this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
        download: this.tax_Production ? this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/attachmentsByComments.json' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/attachmentsByComments.json',
      }
     return tax_reporting;
  }
}
