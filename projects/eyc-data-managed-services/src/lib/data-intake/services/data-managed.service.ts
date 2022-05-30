import { Inject, Injectable } from '@angular/core';
import { DataManagedSettingsService } from './data-managed-settings.service';
import { EycDataApiService } from './eyc-data-api.service';
import { HttpParams } from '@angular/common/http';
import { DataSummary } from '../models/data-summary.model'
import { formatDate } from '@angular/common';
import {DataGrid, ExceptionDataGrid,ExceptionDetailsDataGrid,GroupByDataProviderCardGrid} from '../models/data-grid.model';
import { of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataManagedService {
  // public exceptionDetails: any;
  public exceptionFileName:string;
  public tableName: string;
  public auditDate: string;
  public auditHashID: string;
  public calSelectedMonth: string;
  public presentDate:Date;
  constructor(
    private dataManagedSettingsService: DataManagedSettingsService,
    private eycDataApiService: EycDataApiService
  ) { }

  set setTableName(val: string) {
    this.tableName = val;
  }
  get getTableName(): string {
    return this.tableName;
  }
  set setAuditDate(val: string) {
    this.auditDate = val;
  }
  get getAuditDate(): string {
    return this.auditDate;
  }
  set setAuditHashID(val: string) {
    this.auditHashID = val;
  }
  get getAuditHashID(): string {
    return this.auditHashID;
  }
  // set setExceptionDetails(val: any) {
  //   this.exceptionDetails = val;
  // }
  // get getExceptionDetails(): any {
  //   return this.exceptionDetails;
  // }
  set setExceptionFileName(val: string) {
    this.exceptionFileName = val;
  }
  get getExceptionFileName(): string {
    return this.exceptionFileName;
  }

  businessDate(businessWeekDay: Date): Date {
    const weekDay = businessWeekDay.getDay();
    switch (weekDay) {
      case 0: businessWeekDay.setDate(businessWeekDay.getDate() - 2); break;
      case 1: businessWeekDay.setDate(businessWeekDay.getDate() - 3); break;
      default: businessWeekDay.setDate(businessWeekDay.getDate() - 1); break;
    }
    return businessWeekDay;
  }

  monthLastDate(lastDate: Date): Date {
    return new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);
  }

  prevMonthLastDate(lastDate: Date): Date {
    return new Date(lastDate.getFullYear(), lastDate.getMonth(), 0);
  }

  apiDateFormat(dateParam: Date): string {
    return `${formatDate(dateParam, 'yyyy-MM-dd', 'en')}`;
  }

  ymdToApiDateFormat(dateParam: string): string {
    return `${formatDate(new Date(dateParam).toLocaleDateString(), 'yyyy-MM-dd', 'en')}`;
  }

  monthlyFormat(dateParam: Date): string {
    return formatDate(dateParam, 'MMMM yyyy', 'en');
  }

  montlyDateSub(presentDate: Date): Date {
    const updatedDate = new Date(presentDate.getFullYear(), presentDate.getMonth(), 0);
    return updatedDate;
  }

  montlyDateAdd(presentDate: Date): Date  {
    const updatedDate = new Date(presentDate.getFullYear(), presentDate.getMonth() + 2, 0);
    return updatedDate;;
  }
  
  httpQueryParams(DataSummary: DataSummary): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', DataSummary.startDate);
    params = params.append('endDate', DataSummary.endDate);
    params = params.append('periodType', DataSummary.periodType);
    params = params.append('dueDate', DataSummary.dueDate);
    params = params.append('dataFrequency', DataSummary.dataFrequency);
    params = params.append('dataIntakeType', DataSummary.dataIntakeType);
    if (DataSummary.filterTypes.length > 0) {
      DataSummary.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    return params;
  }

  httpQueryParamsGrid(dataGrid: DataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('dataIntakeType', dataGrid.dataIntakeType);
    params=params.append('summaryType',dataGrid.summaryType).append('reportType',dataGrid.reportType)
    .append('clientName',dataGrid.clientName).append('queryPhrase',dataGrid.queryPhrase);
    
    if (dataGrid.filterTypes.length > 0) {
      dataGrid.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    return params;
  }

  httpQueryParamsExceptionGrid(dataGrid: ExceptionDataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('auditFileGuidName', dataGrid.auditFileGuidName);
    params=params.append('fileId',dataGrid.fileId)
    .append('fileName',dataGrid.fileName)
    .append('clientName',dataGrid.clientName)
    return params;
  }

  
  httpQueryParamsExceptionDetailsDataGrid(dataGrid: ExceptionDetailsDataGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();
    // Begin assigning parameters
    params = params.append('tableName', dataGrid.tableName);
    params = params.append('auditDate', dataGrid.auditDate);
    // params = params.append('auditHashId', dataGrid.auditHashID);
    return params;
  }

  httpQueryParamsProviderCardGrid(dataGrid: GroupByDataProviderCardGrid): HttpParams {
    // Initialize Params Object
    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('startDate', dataGrid.startDate);
    params = params.append('endDate', dataGrid.endDate);
    params = params.append('periodType', dataGrid.periodType);
    params = params.append('dueDate', dataGrid.dueDate);
    params = params.append('dataFrequency', dataGrid.dataFrequency);
    params = params.append('dataIntakeType', dataGrid.dataIntakeType);
    if (dataGrid.filterTypes.length > 0) {
      dataGrid.filterTypes.map((types) => {
        params = params.append('filterTypes', types);
      });
    }
    params = params.append('auditFileGuidName', dataGrid.auditFileGuidName);
    params=params.append('fileId',dataGrid.fileId)
    .append('fileName',dataGrid.fileName)
    .append('clientName',dataGrid.clientName)
    .append('reportId',dataGrid.reportId)
    .append('reportName',dataGrid.reportName)
    .append('isViewClicked', dataGrid.isViewClicked ? 'true' : 'false');
    return params;
  }

  getFileSummaryList(params: DataSummary) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_summary_list}`, this.httpQueryParams(params));
  } 
  getEmbedURL() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.PBI_EMBED_URL}`);
  }  
  getEmbedTokenURL() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.PBI_AUTH_TOKEN_URL}`);
  }                                                 
  getDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider}`);
  }

  getDailyDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_daily}`);
  }

  getMonthlyDataProviderList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_provider_monthly}`);
  }

  getDailyDataDomainList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_domain_daily}`);
  }

  getMonthlyDataDomainList() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_data_domain_monthly}`);
  }

  getDailyGeneralLedgerList(currentPage = 0, noOfRecords = 0) {
    let currentPageValue = `&currentPage=${currentPage}`;
    let noOfRecordsValue = `&numRecords=${noOfRecords}`;
    // After API integration will remove above line and uncomment below line
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_general_ledger_daily}${currentPageValue}${noOfRecordsValue}`);
  }

  getExceptionReportstable() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_reports_table}`);
  }

  getReviewFilesData() {
    return this.eycDataApiService.invokeGetAPI(`${this.dataManagedSettingsService.dataManagedServices.file_review_data}`);
  }
  
  getReviewFileTableData(params: DataGrid) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.file_review_table_data}`,this.httpQueryParamsGrid(params));
  }

  getExceptionTableData(params:ExceptionDataGrid) {
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_table_data}`,this.httpQueryParamsExceptionGrid(params));
  }
  getExceptionDetailsTableData(params:ExceptionDetailsDataGrid, bodyParam: any) {
    const tableName = `?tableName=${params.tableName}`;
    const auditDate = `&auditDate=${params.auditDate}`;
    return this.eycDataApiService.invokePostBodyAPI(`${this.dataManagedSettingsService.dataManagedServices.exception_details_table_data}${tableName}${auditDate}`, bodyParam);
  }
  getReviewByGroupProviderOrDomainGrid(params:GroupByDataProviderCardGrid){
    return this.eycDataApiService.invokePostAPI(`${this.dataManagedSettingsService.dataManagedServices.review_by_group_provider_domain}`,this.httpQueryParamsProviderCardGrid(params));
  }
  getApiBaseUrl(){
    return this.dataManagedSettingsService.dataManagedServices.base_Url;
  }
}
