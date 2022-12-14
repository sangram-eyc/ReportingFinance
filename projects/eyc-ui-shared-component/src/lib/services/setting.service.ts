import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(@Inject('apiEndpoint') private apiEndpoint,
    @Inject('rrproduction') private rrproduction,
    @Inject('taxapiEndpoint') private taxApiEndpoint, @Inject('taxProduction') private taxproduction,
    @Inject('dataManagedProduction') private dataManagedProduction,
    @Inject('dataManagedEndPoint') private dataManagedEndPoint,) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;
  // public API_ENDPOINT = "https://10.48.234.20/qa32/"
  // private rrproduction = true;
  public production = this.rrproduction;
  public dms_API_ENDPOINT = this.dataManagedEndPoint.slice(-1) === "." ?
    this.dataManagedEndPoint.substr(0, this.dataManagedEndPoint.length - 1) : this.dataManagedEndPoint;

  get regReportingFiling(): any {
    const regulatory_Reporting = {
      add_comment: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment',
      list_comments: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/',
      upload: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload',

      //--------------------- For DMS Local Testing Only-----------------------------------------------------
      // add_comment: this.dataManagedProduction ? this.dms_API_ENDPOINT + 'gatewayService/api/v2/commentary/comment' : this.dms_API_ENDPOINT + 'commentaryService/api/v2/commentary/comment',
      // list_comments: this.dataManagedProduction ? this.dms_API_ENDPOINT + 'gatewayService/api/v2/commentary/' : this.dms_API_ENDPOINT + 'commentaryService/api/v2/commentary/',
      // upload: this.dataManagedProduction ? this.dms_API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload' : this.dms_API_ENDPOINT + 'documentService/api/v2/documentService/files/upload',


      download: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download',
      resolve: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/answerExceptionResults/' : this.API_ENDPOINT + 'gatewayService/api/v2/regreporting/answerExceptionResults/',
      add_bulk_comment: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment/bulk' : this.API_ENDPOINT + 'gatewayService/api/v2/commentary/comment/bulk',
      bulk_upload: this.rrproduction ? this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload/comments/bulk' : this.API_ENDPOINT + 'gatewayService/api/v2/documentService/files/upload/comments/bulk',
    }
    return regulatory_Reporting;
  }

  public TAX_API_ENDPOINT = this.taxApiEndpoint.slice(-1) === "." ?
    this.taxApiEndpoint.substr(0, this.taxApiEndpoint.length - 1) : this.taxApiEndpoint;
  public tax_Production = this.taxproduction;
  get taxReportingComments(): any {
    const tax_reporting = {
      update_task_status: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/updateStatusResponse.json',
      delete_tag: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      delete_priority: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/collaboration' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/addCommentResponse.json',
      download: this.tax_Production ? this.TAX_API_ENDPOINT + 'gatewayService/api/v2/documentService/file/download' : this.TAX_API_ENDPOINT + 'assets/eyc-tax-reporting/mock/attachmentsByComments.json',
    }
    return tax_reporting;
  }
}
